import sqliteWasm from '@vlcn.io/crsqlite-wasm'
import wasmUrl from '@vlcn.io/crsqlite-wasm/crsqlite.wasm?url'
import {schema} from './schemas.js'

let globalDb
const dbPromise = (async () => {
	if (globalDb) {
		console.log('Reusing cr-sqlite connection')
		return globalDb
	}
	try {
		const sqlite = await sqliteWasm(() => wasmUrl)
		globalDb = await sqlite.open('mysupernice.db')
		await globalDb.exec(schema)
		console.log('Opened cr-sqlite and ran schema')
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
