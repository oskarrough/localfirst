import {getDb} from './db-crsqlite.js'
import {ChannelSchema, TrackSchema} from '../cli/schema'
import R4Remote from './remotes/r4.js'
import MatrixRemote from './remotes/matrix.js'
import {secondsSince} from './utils/seconds-since.js'

/** The idea with this file is to have a method for every mutation we need on the local database. */

/** @typedef {import('../cli/schema.ts').Channel} Channel */
/** @typedef {import('../cli/schema.ts').Track} Track */

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
    (id, name, slug, createdAt)
    values (?, ?, ?, ?)
    on conflict(id) do update set
    name = excluded.name,
    slug = excluded.slug
  `,
			[c.id, c.name, c.slug, c.created_at],
		),
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
    (id, slug, url, title, description, createdAt, updatedAt)
    values (?, ?, ?, ?, ?, ?, ?)
    on conflict(id) do update set
    url = excluded.url,
    title = excluded.title,
    description = excluded.description,
    updatedAt = excluded.updatedAt
  `,
				[x.id, x.slug, x.url, x.title, x.description, x.createdAt, x.updatedAt],
			),
		)
		await Promise.all(promises)
	} catch (err) {
		console.log(err)
	}
}
