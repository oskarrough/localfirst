import {getDb} from './local-db.js'
import {ChannelSchema, TrackSchema} from './schemas.js'

/** The idea with this file is to have a method for every mutation we need on the local database. */

/** @typedef {import('./schemas.js').Channel} Channel */
/** @typedef {import('./schemas.js').Track} Track */

/** Upserts a list of (valid) channels to the local database
 * @param {Array<Channel>} data
 */
export async function insertChannels(data) {
	const db = await getDb()
	const valid = data.filter((t) => ChannelSchema.safeParse(t).success)
	console.log(` ↓ ${valid.length} channels`)
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
}

/** Upserts a list of (valid) tracks into the local database
 * @param {Array<Track>} tracks
 */
export async function insertTracks(tracks) {
	const db = await getDb()
	const valid = tracks.filter((t) => TrackSchema.safeParse(t).success)
	console.log(` ↓ ${valid.length} tracks from ${tracks[0].slug}`)
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
