import {ChannelSchema, TrackSchema} from './types.js'
import sqliteWasm, {DB} from '@vlcn.io/crsqlite-wasm'
import wasmUrl from '@vlcn.io/crsqlite-wasm/crsqlite.wasm?url'

/** @typedef {import('./types.js').Channel} Channel */
/** @typedef {import('./types.js').Track} Track */

const schema = `
	create table if not exists channels(id primary key, name, slug unique, created_at);
	create table if not exists tracks(id primary key, slug not null, url, title, description, created_at, updated_at, foreign key(slug) references channels(slug) on delete cascade);
  create table if not exists counters(id primary key, count integer);
  --select crsql_as_crr('channels');
  --select crsql_as_crr('tracks');
`

// Ensure we only open the database once
const dbPromise = (async () => {
	const sqlite = await sqliteWasm(() => wasmUrl)
	const db = await sqlite.open('my.db')
	await db.exec(schema)
	return db
})()
export async function getDb() {
	return dbPromise
}

/** Upserts a list of channels to the local database
 * @param {Array<Channel>} data
 */
export async function insertChannels(data) {
	const db = await getDb()
	const valid = data.filter((t) => ChannelSchema.safeParse(t).success)
	console.log(` ↓ ${valid.length} channels`, valid)
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

/** Upserts a list of tracks into the local database
 * @param {Array<Track>} tracks
 */
export async function insertTracks(tracks) {
	const db = await getDb()
	const valid = tracks.filter((t) => TrackSchema.safeParse(t).success)
	console.log(` ↓ ${valid.length} tracks from ${tracks[0].slug}`, valid)
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
