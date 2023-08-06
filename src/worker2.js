import * as Comlink from 'comlink'
import sqlite3InitModule from '@sqlite.org/sqlite-wasm'
import {schema} from './types.js'

import {secondsSince} from './utils/seconds-since.js'
import R4Remote from './remotes/r4.js'
import MatrixRemote from './remotes/matrix.js'

const ROOM_ID = '!aGwogbKehPpaWCGFIf:matrix.org'

// This worker shows using SQLite3 in a worker thread via OPFS.
let globalDb

// Immediately executed, singleton promise that resolves to the same database connection.
const dbPromise = (async () => {
  if (globalDb) {
    console.log('reusing')
    return globalDb
  }
  const sqlite = await sqlite3InitModule({print: console.log, printErr: console.error})
	const db = openDb(sqlite)
	await db.exec(schema)
  const rows = db.selectArray('select count(id) from employees')
  console.log(`Loaded SQLite ${sqlite.version.libVersion}`, rows)
  globalDb = db
	return db
})()

// Ensure we only open the database once
export async function getDb() {
  // console.log('getDb')
	return dbPromise
}

function openDb(sqlite3, filename = '/mydb.sqlite3') {
  // console.log('openDb')
	let db
	if ('opfs' in sqlite3) {
		db = new sqlite3.oo1.OpfsDb(filename)
		console.log('OPFS is available, created persisted database at', db.filename)
	} else {
		db = new sqlite3.oo1.DB(filename, 'ct')
		console.log('OPFS is not available, created transient database', db.filename)
	}
	return db
}

async function exec(...args) {
  const db = await getDb()
	return db.exec(...args)
}

async function query(...args) {
  const db = await getDb()
	return db.selectObjects(...args)
}

async function sync() {
  console.log('worker: syncing...')
	const t0 = performance.now()
	const db = await getDb()
  const settings = await getSettings()
  const remotes = []
  if (settings.provider_r4) remotes.push(new R4Remote(db))
  if (settings.provider_matrix) remotes.push(new MatrixRemote(db, {roomId: ROOM_ID}))
	// await db.exec('begin transaction')
	await Promise.all(remotes.map((r) => r.pull()))
	// await db.exec('commit')
	console.log(`sync done in ${secondsSince(t0)}s`)
}

async function dump() {
  await (await getDb()).exec('delete from settings; delete from channels; delete from tracks;')
  console.log('worker: dumped')
}

async function getSettings() {
  const db = await getDb()
  return await db.selectObjects('select * from settings where id = 1')[0]
}

Comlink.expose({db: globalDb, getDb, exec, query, sync, dump})

