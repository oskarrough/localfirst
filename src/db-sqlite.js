import sqlite3InitModule from '@sqlite.org/sqlite-wasm'
import {channelsTable, tracksTable, settingsTable, testTables} from '../cli/schema'

// SQLite in the browser via WASM and sqlite-wasm
// console.error('dont use')

const DATABASE_FILENAME = '/test-sqlite.sqlite3'

let globalDb

export const initializeSqlite = async () => {
	if (globalDb) {
		console.log('reusing sqlite-wasm connection')
		return globalDb
	}
	try {
		const sqlite = await sqlite3InitModule({print: console.log, printErr: console.error})
		if ('opfs' in sqlite) {
			globalDb = new sqlite.oo1.OpfsDb(DATABASE_FILENAME)
			console.log('OPFS is available, created persisted database at', globalDb.filename)
		}
		else {
			globalDb = new sqlite.oo1.DB(DATABASE_FILENAME, 'ct')
			console.log('OPFS not available, created transient database', globalDb.filename)
		}
		globalDb.exec(channelsTable)
		globalDb.exec(tracksTable)
		globalDb.exec(settingsTable)
		globalDb.exec(testTables)

		console.log(`Opened sqlite-wasm ${sqlite.version.libVersion} and ran schemas`)
		return globalDb
	} catch (error) {
		console.error('Error initializing cr-sqlite', error)
		throw error
	}
}
// initializeSqlite()

// export async function getDb() {
// 	return dbPromise
// }
