// import sqliteWasm = from "https://esm.sh/@vlcn.io/crsqlite-wasm@0.14.0"
// sqlite = sqliteWasm.default(
//   (file) => "https://esm.sh/@vlcn.io/crsqlite-wasm@0.14.0/dist/crsqlite.wasm"
// )
import { sdk } from 'https://cdn.jsdelivr.net/npm/@radio4000/sdk/+esm'
import { getDb } from './local.js'
import { nanoid } from 'nanoid'

let db

async function main() {
  const t0 = performance.now()
  db = await getDb()
  // console.log('worker:', nanoid())
  const channels = await pullChannels()
  console.log(channels)
  await Promise.all(channels.map(c => pullTracks(c.slug)))
  const duration = ((performance.now() - t0) / 1000).toFixed(3)
  postMessage(`sync done in ${duration}s`)
}
main()

onmessage = async function (event) {
	console.log('main thread says:', event.data)
	// postMessage('done')
}

async function pullChannels() {
  const t0 = performance.now()

  // Get remote channels.
	const {data: channels} = await sdk.channels.readChannels()

  // Upsert all locally.
	const promises = channels.map((c) => db.exec(`
    insert into channels 
    (id, name, slug, created_at) 
    values (?, ?, ?, ?)
    on conflict(id) do update set
    name = excluded.name,
    slug = excluded.slug
  `, [c.id, c.name, c.slug, c.created_at]))
	await Promise.all(promises)

  const duration = ((performance.now() - t0) / 1000).toFixed(3)
  postMessage(`pulled ${channels.length} channels in ${duration}s`)
	return await db.execO('select * from channels')
}

async function pullTracks(slug) {
  const t0 = performance.now()
  // postMessage(`pulling tracks for ${slug}...`)
	const { data, error } = await sdk.channels.readChannelTracks(slug)
  if (error || !data?.length) return
	const promises = data.slice(0, 100).map((x) => db.exec(`
    insert into tracks 
    (id, slug, url, title, description, created_at, updated_at) 
    values (?, ?, ?, ?, ?, ?, ?)
    on conflict(id) do update set
    url = excluded.url,
    title = excluded.title,
    description = excluded.description,
    updated_at = excluded.updated_at
  `, [x.id, slug, x.url, x.title, x.description, x.created_at, x.updated_at]))
	await Promise.all(promises)
  const duration = ((performance.now() - t0) / 1000).toFixed(3)
  postMessage(`pulled ${data.length} tracks for ${slug} in ${duration}s`)
	return await db.execO('select * from tracks where slug = ?', [slug])
}
