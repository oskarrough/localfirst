import * as Comlink from 'comlink'
import sqlite3InitModule from '@sqlite.org/sqlite-wasm'
import {schema} from './schemas.js'
import R4Remote from './remotes/r4.js'
import MatrixRemote from './remotes/matrix.js'
import {secondsSince} from './utils/seconds-since.js'

const MATRIX_TEST_ROOM_ID = '!aGwogbKehPpaWCGFIf:matrix.org'

// This worker shows using SQLite3 in a worker thread via OPFS.
let globalDb

// @todo make this configurable in the settings for remote matrix. This is current #r4radiotest123:matrix.org
const ROOM_ID = '!aGwogbKehPpaWCGFIf:matrix.org'

// Immediately executed, singleton promise that resolves to the same database connection.
const dbPromise = (async () => {
	if (globalDb) {
		console.log('reusing "globalDb" SQLite connection')
		return globalDb
	}
	const sqlite = await sqlite3InitModule({print: console.log, printErr: console.error})
	const db = openDb(sqlite)
	await db.exec(schema)
	console.log(`Loaded SQLite ${sqlite.version.libVersion} and ran our schema`)

	const rows = db.selectArray('select count(id) from employees')
	console.log('test query', rows)

	globalDb = db
	return db
})()

function openDb(sqlite3, filename = '/mydb.sqlite3') {
	const db = 'opfs' in sqlite3 ? new sqlite3.oo1.OpfsDb(filename) : new sqlite3.oo1.DB(filename, 'ct')
	'opfs' in sqlite3
		? console.log('OPFS is available, created persisted database at', db.filename)
		: console.log('OPFS not available, created transient database', db.filename)
	return db
}

// Ensure we only open the database once
export async function getDb() {
	// console.log('getDb')
	return dbPromise
}

/** https://sqlite.org/wasm/doc/trunk/api-oo1.md#db-exec */
async function exec(...args) {
	const db = await getDb()
	return db.exec(...args)
}

/** Convenience wrapper, runs selectObjects on the db */
async function query(...args) {
	const db = await getDb()
	return db.selectObjects(...args)
}

async function pull() {
	const t0 = performance.now()
	const db = await getDb()
	const settings = await getSettings()
	const remotes = []
	if (settings.provider_r4) remotes.push(new R4Remote(db))
	if (settings.provider_matrix) remotes.push(new MatrixRemote(db, {roomId: MATRIX_TEST_ROOM_ID}))
	console.log('new remotes?', db)
	// await db.exec('begin transaction')
	await Promise.all(remotes.map((r) => r.pull()))
	// await db.exec('commit')
	console.log(`worker: pulled in ${secondsSince(t0)}s`)
}

async function deleteAll() {
	await (await getDb()).exec('delete from settings; delete from channels; delete from tracks;')
	console.log('worker: deleted settings, channels and tracks')
	try {
		await (await getDb()).exec('delete from settings; delete from channels; delete from tracks;')
		const db = await getDb()
		console.log('worker: dumped')
		const what = await db.selectObjects('select * from channels;')
		console.log(what)
	} catch (err) {
		console.log('failed to dump')
		console.log(err)
		console.error(err)
	}
}	

async function getSettings() {
	const db = await getDb()
	return await db.selectObjects('select * from settings where id = 1')[0]
}

Comlink.expose({db: globalDb, getDb, exec, query, pull, deleteAll})
