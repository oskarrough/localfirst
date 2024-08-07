import * as Comlink from 'comlink'
import sqlite3InitModule from '@sqlite.org/sqlite-wasm'
import {schema} from './schemas.js'
import R4Remote from './remotes/r4.js'
import MatrixRemote from './remotes/matrix.js'
import {secondsSince} from './utils/seconds-since.js'

const DATABASE_FILENAME = '/mydb2.sqlite3'

// @todo make this configurable in the settings for remote matrix. This is current #r4radiotest123:matrix.org
const MATRIX_TEST_ROOM_ID = '!aGwogbKehPpaWCGFIf:matrix.org'

// This worker shows using SQLite3 in a worker thread via OPFS.
let globalDb

// Immediately executed, singleton promise that resolves to the same database connection.
const dbPromise = (async () => {
	if (globalDb) {
		console.log('reusing sqlite-wasm connection')
		return globalDb
	}
	// Set up and schema.
	const sqlite = await sqlite3InitModule({print: console.log, printErr: console.error})
	globalDb = openDb(sqlite)
	await globalDb.exec(schema)
	console.log(`Opened sqlite-wasm ${sqlite.version.libVersion} and ran our schema`)
	// Test queries
	const employees = globalDb.selectArray('select count(id) from employees')[0]
	const tracks = globalDb.selectArray('select count(id) from tracks')[0]
	console.log('test query', {employees, tracks})
	// Return the connection
	return globalDb
})()

function openDb(sqlite3, filename = DATABASE_FILENAME) {
	const db = 'opfs' in sqlite3 ? new sqlite3.oo1.OpfsDb(filename) : new sqlite3.oo1.DB(filename, 'ct')
	'opfs' in sqlite3
		? console.log('OPFS is available, created persisted database at', db.filename)
		: console.log('OPFS not available, created transient database', db.filename)
	return db
}

export async function getDb() {
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
	// await db.exec('begin transaction')
	await Promise.all(remotes.map((r) => r.pull()))
	// await db.exec('commit')
	console.log(`worker: pulled in ${secondsSince(t0)}s`)
}

async function deleteAll() {
	try {
		const db = await getDb()
		await db.exec('delete from employees; delete from settings; delete from channels; delete from tracks;')
		console.log('deleted settings, channels and tracks')
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
