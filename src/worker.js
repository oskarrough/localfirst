import * as Comlink from 'comlink'

import {getDb} from './local-db.js'
import {secondsSince} from './utils/seconds-since.js'
import R4Remote from './remotes/r4.js'
import MatrixRemote from './remotes/matrix.js'

const ROOM_ID = '!aGwogbKehPpaWCGFIf:matrix.org'

async function sync() {
  console.log('worker: syncing...')
	const t0 = performance.now()
	const db = await getDb()
	const remotes = [
		new R4Remote(db),
		new MatrixRemote(db, {roomId: ROOM_ID})
	]
	// await db.exec('begin transaction')
	await Promise.all(remotes.map((r) => r.pull()))
	// await db.exec('commit')
	console.log(`sync done in ${secondsSince(t0)}s`)
}

async function dump() {
  await (await getDb()).exec('delete from channels; delete from tracks;')
  console.log('worker: dumped')
}

Comlink.expose({sync, dump})

