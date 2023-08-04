import {sdk} from '@radio4000/sdk'
import {readTracks} from './r4-matrix-sdk.js'
import {getDb} from './local.js'
import {ChannelSchema, TrackSchema} from './types'

/** @typedef {import('./types').Channel} Channel */
/** @typedef {import('./types').Track} Track */

export async function pullChannels() {
	const {data, error} = await sdk.channels.readChannels()
	if (!error && data?.length) {
		insertChannels(data)
	}
}

export async function pullTracks(slug) {
	const {data, error} = await sdk.channels.readChannelTracks(slug)
	if (!error && data?.length) {
		const tracks = data?.map((t) => ({...t, slug}))
		insertTracks(tracks)
	}
}

export async function pullMatrixTracks(roomId) {
	const tracks = await readTracks(roomId)
	if (tracks?.length) {
		insertTracks(tracks)
	}
}

/** Upserts a list of channels to the local database */
export async function insertChannels(data) {
	const valid = data.filter((t) => ChannelSchema.safeParse(t).success)
	console.log(`${valid.length}/${data.length} valid channels`)

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

/** Upserts a list of tracks into the local database */
export async function insertTracks(tracks) {
	const valid = tracks.filter((t) => TrackSchema.safeParse(t).success)
	const invalid = tracks.filter((t) => !TrackSchema.safeParse(t).success)
	console.log(`${valid.length}/${tracks.length} valid tracks`, {invalid})

	const db = await getDb()
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
