import {$} from 'bun'
import {Database} from 'bun:sqlite'
import {parseArgs} from 'util'
import filenamify from 'filenamify/browser'
import {createBackup} from '../utils.ts'
import type {Track} from '../schema'
import {mkdir} from 'node:fs/promises'

// Run with  bun src/cli/r4.ts --slug oskar --limit 3 --folder src/cli/oskar

// Get CLI arguments (only strings + booleans)
const {values, positionals} = parseArgs({
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
		includeFailed: {
			type: 'boolean',
		},
		force: {
			type: 'boolean',
		},
	},
	strict: true,
	allowPositionals: true,
})
// console.log('cli values', values)
// console.log('cli positionals', positionals)
if (!values.slug) throw Error('Pass in `--slug <my-radio>` to select your channel')

main(values.slug, Number(values.limit))

async function downloadTrack(track: Track, folder: string) {
	const title = filenamify(track.title, {replacement: ' ', maxLength: 255})
	const filepath = `${folder}${title}`

	// console.log({track, title, filepath})

	// When a file already exists, by default yt-dlp will skip the download but it will still refresh metadata.
	// This is slow, so we skip completely here. @todo make option to force download.
	const maybeFilename = `${filepath} [${track.providerId}].m4a`
	const fileExists = await Bun.file(maybeFilename).exists()
	if (fileExists && !values.force) {
		return Promise.resolve('fileExists')
	}
	try {
		return await downloadAudio(track.url, `${filepath} [%(id)s].%(ext)s`, track.description || track.url)
	} catch (err) {
		// throw err
		throw Error(`Failed to download audio: ${err.stderr.toString()}`)
		// console.log(err.stdout.toString())
		// console.log(err.stderr.toString())
	}
}

/** Downloads the audio from a URL (supported by yt-dlp) */
async function downloadAudio(url: string, filepath: string, metadataDescription: string) {
	// return $`yt-dlp -f 'bestaudio[ext=m4a]' --no-playlist --restrict-filenames --output ${filepath} ${url}`
	return $`yt-dlp -f 'bestaudio[ext=m4a]' --no-playlist --restrict-filenames --output ${filepath} --parse-metadata "${metadataDescription}:%(meta_comment)s" --embed-metadata ${url}`
}

/** Set up (or reuse) a local sqlite database */
async function setupDatabase() {
	if (!values.folder) throw Error('Pass in `--folder <path>` to decide where to store your radio')
	await mkdir(`${values.folder}/${values.slug}`, {recursive: true})
	const dbpath = `${values.folder}/${values.slug}/${values.slug}.sqlite`
	const db = new Database(dbpath)
	db.exec('PRAGMA journal_mode = WAL;')
	db.run(
		`CREATE TABLE IF NOT EXISTS tracks (id TEXT PRIMARY KEY, slug TEXT, title TEXT, description TEXT, url TEXT, discogs_url TEXT, provider TEXT, provider_id TEXT, created_at TEXT, updated_at TEXT, tags TEXT, mentions TEXT, downloaded INTEGER DEFAULT 0, last_error TEXT);`,
	)
	return db
}

/** Downloads all tracks from a radio */
async function main(slug: string, maxTracks: number) {
	const db = await setupDatabase()

	// Fetch remote radio + tracks.
	const {data, error} = await createBackup(slug, maxTracks)
	if (error) {
		console.error(error)
		return
	}
	// Store the full response as a local file.
	await Bun.write(`${values.folder}/${values.slug}/${values.slug}.json`, JSON.stringify(data, null, 2))

	// For each remote track, check if we have a local error from trying to download it before.
	const tracks = data.tracks.map((t: Track) => {
		const q = db.query('select last_error from tracks where id = $id;')
		const row = q.get({$id: t.id})
		t.lastError = row?.last_error
		return t
	})
	const tracksWithError = tracks.filter((t) => t.lastError)

	const query = db.query(`SELECT count(id) as total FROM tracks`)

	console.log(`Downloading ${data.radio.name} to ${values.folder}/${values.slug}`, {
		localTracks: query.get().total,
		remoteTracks: tracks.length,
		working: tracks.length - tracksWithError.length,
		failing: tracksWithError.length,
	})

	if (!values.includeFailed) {
		console.log('Use --includeFailed to also download tracks that previously failed to do so')
	}

	const filteredTracks = values.includeFailed ? tracks : tracks.filter((t) => !t.lastError)
	if (values.includeFailed) {
		console.log(`Processing tracks ${filteredTracks.length} (including failed)`)
	} else {
		console.log(`Processing tracks ${filteredTracks.length} (skipping failed)`)
	}

	let current = 0
	for await (const t of filteredTracks) {
		current++
		const indexLog = `${current}/${filteredTracks.length}`

		const insertTrack = db.query(
			`INSERT OR REPLACE INTO tracks (id, slug, title, url, provider, provider_id) VALUES ($id, $slug, $title, $url, $provider, $providerId);`,
		)
		insertTrack.run({
			$id: t.id,
			$slug: t.slug,
			$title: t.title,
			$url: t.url,
			$provider: t.provider,
			$providerId: t.providerId,
		})

		try {
			const x = await downloadTrack(t, `${values.folder}/${values.slug}/tracks/`)
			if (x === 'fileExists') {
				console.log(indexLog, 'Updated existing file', t.title)
			} else {
				console.log(indexLog, 'Downloaded', t.title)
			}
			// Mark as downloaded.
			db.query(`UPDATE tracks SET downloaded = 1 WHERE id = $id;`).run({
				$id: t.id,
			})
		} catch (err) {
			console.log(indexLog, 'Failed to download', err)
			// Mark as failed.
			db.query(`UPDATE tracks SET downloaded = 0, last_error = $error WHERE id = $id;`).run({
				$id: t.id,
				$error: err.message,
			})
		}
	}
}
