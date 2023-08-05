import {sdk} from '@radio4000/sdk'
import {readTracks} from './r4-matrix-sdk.js'
import {getDb} from './local.js'
import {ChannelSchema, TrackSchema} from './types.js'

/** @typedef {import('./types.js').Channel} Channel */
/** @typedef {import('./types.js').Track} Track */

export async function pullChannels() {
	const {data, error} = await sdk.channels.readChannels()
	if (!error && data?.length) {
		insertChannels(data)
	}
}

/** @param {string} slug */
export async function pullTracks(slug) {
	const {data, error} = await sdk.channels.readChannelTracks(slug)
	if (error || !data?.length) return
	const tracks = data?.map((t) => ({...t, slug}))
	insertTracks(tracks)
}

/** @param {string} roomId */
export async function pullMatrixTracks(roomId) {
	return insertTracks(await readTracks(roomId))
}

/** Upserts a list of channels to the local database
 * @param {Array<Channel>} data
 */
export async function insertChannels(data) {
	const valid = data.filter((t) => ChannelSchema.safeParse(t).success)
	// console.log(`${valid.length}/${data.length} valid channels`)
	const db = await getDb()
	// await db.exec('begin transaction')
	const promises = valid.map((c) =>
		db.exec(
			`
    insert into channels 
    (id, name, slug, created_at) 
    values (?, ?, ?, ?)
    on conflict(id) do update set
    name = excluded.name,
    slug = excluded.slug
  `,
			[c.id, c.name, c.slug, c.created_at]
		)
	)
	await Promise.all(promises)
	// await db.exec('commit')
}

/** Upserts a list of tracks into the local database
 * @param {Array<Track>} tracks
 */
export async function insertTracks(tracks) {
	const db = await getDb()
	const valid = tracks.filter((t) => TrackSchema.safeParse(t).success)
	//const invalid = tracks.filter((t) => !TrackSchema.safeParse(t).success)
	//console.log(`${valid.length}/${tracks.length} valid tracks`, {invalid})
	try {
		const promises = valid.map((x) =>
			db.exec(
				`
    insert into tracks 
    (id, slug, url, title, description, created_at, updated_at) 
    values (?, ?, ?, ?, ?, ?, ?)
    on conflict(id) do update set
    url = excluded.url,
    title = excluded.title,
    description = excluded.description,
    updated_at = excluded.updated_at
  `,
				[x.id, x.slug, x.url, x.title, x.description, x.created_at, x.updated_at]
			)
		)
		await Promise.all(promises)
	} catch (err) {
		console.log(err)
	}
}
