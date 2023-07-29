import { sdk } from 'https://cdn.jsdelivr.net/npm/@radio4000/sdk/+esm'
import { getDb } from './local.js'

export async function pullChannels() {
	const { data, error } = await sdk.channels.readChannels()
	if (error || !data?.length) return []
	const db = await getDb()
	await db.exec('begin transaction')
	const promises = data.map((c) =>
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
	await db.exec('commit')
}

export async function pullTracks({ slug }) {
	const { data, error } = await sdk.channels.readChannelTracks(slug)
	if (error || !data?.length) return
	const db = await getDb()
	const promises = data.map((x) =>
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
			[x.id, slug, x.url, x.title, x.description, x.created_at, x.updated_at]
		)
	)
	await Promise.all(promises)
}
