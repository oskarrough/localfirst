import {getDb} from './local.js'
import {pullChannels, pullTracks, pullMatrixTracks} from './worker-sync.js'
import {secondsSince} from './utils/seconds-since.js'

const db = await getDb()
const ROOM_ID = '!aGwogbKehPpaWCGFIf:matrix.org'

/**
 * This worker is a demo using SQLite3 via indexeddb a worker thread.
 */

onmessage = async function (event) {
	console.log('main thread says:', event.data)
}

const t0 = performance.now()

// Sync channels
await pullChannels()

// Sync tracks from the channels.
/** @type {Array<import('./types.js').Channel>} */
const channels = await db.execO('select * from channels')
await db.exec('begin transaction')
postMessage(`syncing ${channels.length} channels incl. their tracks`)
await Promise.all(channels.map((channel) => pullTracks(channel.slug)))
await db.exec('commit')
postMessage(`r4sdk sync done in ${secondsSince(t0)}s`)

// Sync tracks from a certain matrix room.
await db.exec('begin transaction')
await pullMatrixTracks(ROOM_ID)
await db.exec('commit')
postMessage(`matrix sync done in ${secondsSince(t0)}s`)
