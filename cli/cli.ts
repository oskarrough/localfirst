/* eslint-env node */

import {Glob} from 'bun'
import {mkdir} from 'node:fs/promises'
import {existsSync} from 'node:fs'
import {parseArgs} from 'util'
import pLimit from 'p-limit'
import {ProgressBar} from '@opentf/cli-pbar'

import {toFilename, fetchRemoteTracks, remoteTrackToTrack} from './utils'
import {setupDatabase, getTracks, upsertTrack} from './database'
import {downloadTrack} from './utils-node'

// 1. Get CLI arguments (only strings + booleans)
const {values} = parseArgs({
	// eslint-disable-next-line no-undef
	args: Bun.argv,
	options: {
		slug: {
			type: 'string',
		},
		limit: {
			type: 'string',
			default: '4000',
		},
		folder: {
			type: 'string',
		},
		downloadFailed: {
			type: 'boolean',
		},
		pull: {
			type: 'boolean',
		},
		download: {
			type: 'boolean',
		},
	},
	strict: true,
	allowPositionals: true,
})
if (!values.slug) console.log('--slug <my-radio> selects your raadio channel')
if (!values.folder) console.log('--folder <path> creates a folder for your radio here')
if (!values.slug || !values.folder) process.exit(1)
const slug = values.slug
const limit = Number(values.limit)
const folder = `${values.folder}/${values.slug}`
const databasePath = `${folder}/${slug}.sqlite`
const tracksFolder = `${folder}/tracks`

// Use this for longer tasks
const pBar = new ProgressBar({
	// variant: 'PLAIN',
	// prefix: 'Downloading',
	size: 'SMALL',
	showPercent: false,
	autoClear: true,
	showCount: true,
})

console.time('STOP')

/** If the folder doesn't exist we can't continue */
await mkdir(tracksFolder, {recursive: true})

/** Create or reuse a local sqlite3 database */
const db = await setupDatabase(databasePath)

/** Find existing files on disk */
const glob = new Glob(`${tracksFolder}/*.m4a`)
const localFiles = await Array.fromAsync(glob.scan('.'))

/** Find tracks stored in local database */
const tracks = getTracks(db)

/** Fetch remote tracks from Radio4000 */
const {data, error} = await fetchRemoteTracks(slug, limit)
if (error) throw Error(`remote: Failed to fetch tracks: ${error.message}`)
const remoteTracks = data.map(remoteTrackToTrack).filter((x) => x !== null)

console.log('START:', slug, limit, databasePath)
console.log(tracks.length, 'tracks')
console.log(tracks.filter((t) => t.lastError).length, 'errors')
console.log(localFiles.length, 'files')
console.log(remoteTracks.length, 'Radio4000 tracks')
if (data.length - remoteTracks.length > 0) {
	console.log(data.length - remoteTracks.length, 'R4 track(s) failed to parse')
}

// Check if there are new R4 tracks to pull.
const localIds = new Set(tracks.map((t) => t.id))
const incomingTracks = remoteTracks.filter((track) => !localIds.has(track.id))
if (incomingTracks.length) {
	console.log('--pull', incomingTracks.length, 'remote tracks from Radio4000')
	if (values.pull) {
		incomingTracks.forEach((t) => {
			upsertTrack(db, t)
		})
		console.log('Done pulling')
	}
} else {
	// console.log('Nothing to pull')
}

if (values.download) {
	const list = getTracks(db)
		.slice(0, limit)
		.filter((track) => {
			const filename = toFilename(track, tracksFolder)
			const exists = existsSync(filename)
			if (exists && !track.files) {
				console.log('Found existing track', track.id)
				db.query('update tracks set files = ? where id = ?').run(filename, track.id)
			}
			return !exists
		})
		.filter((track) => (values.downloadFailed ? true : !track.lastError))
	if (list.length) {
		console.log('Downloading', list.length, 'tracks. It will take around', list.length * 4, 'seconds. See ya')

		pBar.start({total: list.length})
		pBar.update({suffix: 'downloading tracks'})
		const limiter = pLimit(5)
		const input = list.map((track) =>
			limiter(async () => {
				await downloadTrack(track, toFilename(track, tracksFolder), db)
				pBar.inc()
			}),
		)
		await Promise.all(input)
		pBar.stop()

		console.log(
			getTracks(db)
				.slice(0, limit)
				.filter((x) => x.files).length,
			'tracks downloaded.',
		)

		console.log(
			getTracks(db)
				.slice(0, limit)
				.filter((x) => x.lastError).length,
			'tracks failed to download. Use --downloadFailed to try again',
		)
	} else {
		// console.log('all downloaded')
	}
} else {
	const toDownload = getTracks(db).filter((t) => !t.lastError && !t.files)
	console.log('--download', toDownload.length, 'missing files')
}

if (values.download && !values.downloadFailed) {
	const q2 = getTracks(db).filter((t) => t.lastError)
	console.log('--download --downloadFailed to include', q2.length, 'files that previously failed')
}

/*
↓
↑
 */

// await Bun.write(`${folder}/${slug}.json`, JSON.stringify({tracks: getTracks(db)}, null, 2))
console.timeEnd('STOP')
