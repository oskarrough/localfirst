import {getDb} from './local-db.js'
import {secondsSince} from './utils/seconds-since.js'
import R4Remote from './remotes/r4.js'
import MatrixRemote from './remotes/matrix.js'

const ROOM_ID = '!aGwogbKehPpaWCGFIf:matrix.org'

onmessage = async function (event) {
	console.log('main thread says:', event.data)
	if (event.data === 'sync') sync()
	if (event.data === 'dump') dump()
}

async function sync() {
	const t0 = performance.now()
	const db = await getDb()
	const remotes = [
		new R4Remote(db),
		new MatrixRemote(db, {roomId: ROOM_ID})
	]

	await db.exec('begin transaction')
	await Promise.all(remotes.map((r) => r.pull()))
	await db.exec('commit')

	postMessage(`sync done in ${secondsSince(t0)}s`)
}

async function dump() {
  await (await getDb()).exec('delete from channels; delete from tracks;')
  postMessage('dumped all channels and tracks')
}


/*
console.log('42')
const db = await getDb()
const mr = new MatrixRemote(db, {roomId: ROOM_ID})
mr.push()
*/