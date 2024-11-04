import {channelsTable, tracksTable, settingsTable, testTables} from './cli/schema'
import sqliteWasm from '@vlcn.io/crsqlite-wasm'
import wasmUrl from '@vlcn.io/crsqlite-wasm/crsqlite.wasm?url'

// SQLite in the browser via WASM and cr-sqlite

const DATABASE_FILENAME = '/test-crsqlite.sqlite3'

let globalDb

const dbPromise = (async () => {
	if (globalDb) {
		console.log('Reusing cr-sqlite connection')
		return globalDb
	}
	try {
		const sqlite = await sqliteWasm(() => wasmUrl)
		globalDb = await sqlite.open(DATABASE_FILENAME)
		await globalDb.exec(channelsTable)
		await globalDb.exec(tracksTable)
		await globalDb.exec(settingsTable)
		await globalDb.exec(testTables)
		console.log('Opened cr-sqlite and ran schemas')
		return globalDb
	} catch (error) {
		console.error('Error initializing cr-sqlite', error)
		throw error
	}
})()

// Ensure we only open the database once
export async function getDb() {
	return dbPromise
}
