import {sdk} from 'https://cdn.jsdelivr.net/npm/@radio4000/sdk/+esm'
import {getDb} from './local.js'

let db
async function main() {
  const t0 = performance.now()
  // Open database, pull channels and tracks.
  db = await getDb()
  await pullChannels()
	const channels = await db.execO('select * from channels')
  await db.exec(`begin transaction`)
  await Promise.all(channels.map(pullTracks))
  await db.exec(`commit`)
  postMessage(`sync done in ${logTime(t0)}s`)
}
main()

onmessage = async function (event) {
	console.log('main thread says:', event.data)
}

async function executeInBatches(promises, batchSize) {
  const results = []

  for (let i = 0; i < promises.length; i += batchSize) {
    const batch = promises.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(p => (typeof p === 'function') ? p() : p))
    results.push(batchResults)
  }

  return results
}

async function pullChannels() {
	const {data, error} = await sdk.channels.readChannels()
  if (error || !data?.length) return []
  const t0 = performance.now()
  await db.exec(`begin transaction`)
	const promises = data.map((c) => db.exec(`
    insert into channels 
    (id, name, slug, created_at) 
    values (?, ?, ?, ?)
    on conflict(id) do update set
    name = excluded.name,
    slug = excluded.slug
  `, [c.id, c.name, c.slug, c.created_at]))
	await Promise.all(promises)
  await db.exec(`commit`)
  postMessage(`pulled ${data.length} channels in ${logTime(t0)}s`)
}

async function pullTracks({slug}) {
	const { data, error } = await sdk.channels.readChannelTracks(slug)
  if (error || !data?.length) return
  postMessage(`pulling from ${slug}`)
  const t0 = performance.now()
	const promises = data.map((x) => db.exec(`
    insert into tracks 
    (id, slug, url, title, description, created_at, updated_at) 
    values (?, ?, ?, ?, ?, ?, ?)
    on conflict(id) do update set
    url = excluded.url,
    title = excluded.title,
    description = excluded.description,
    updated_at = excluded.updated_at
  `, [x.id, slug, x.url, x.title, x.description, x.created_at, x.updated_at]))
	await executeInBatches(promises, 500)
  postMessage(`pulled ${data.length} tracks for @${slug} in ${logTime(t0)}s`)
}

// For debugging.
const logTime = (startMs) => ((performance.now() - startMs) / 1000).toFixed(3)
