import { getDb } from './local.js'
import { pullChannels, pullTracks } from './worker-sync.js'

onmessage = async function (event) {
	console.log('main thread says:', event.data)
}

// Prepare
const logTime = (startMs) => ((performance.now() - startMs) / 1000).toFixed(3)
const t0 = performance.now()
const db = await getDb()

// Sync
await pullChannels()
const channels = await db.execO('select * from channels')
await db.exec('begin transaction')
await Promise.all(channels.map(pullTracks))
await db.exec('commit')
postMessage(`sync done in ${logTime(t0)}s`)
