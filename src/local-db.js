import sqliteWasm from '@vlcn.io/crsqlite-wasm'
import wasmUrl from '@vlcn.io/crsqlite-wasm/crsqlite.wasm?url'
import {schema} from './schemas.js'

// Singleton promise.
let globalDb
const dbPromise = (async () => {
	if (globalDb) {
		console.log('reusing cr-sqlite connection')
		return globalDb
	}
	const sqlite = await sqliteWasm(() => wasmUrl)
	const db = await sqlite.open('my.db')
	await db.exec(schema)
	console.log('opened cr-sqlite and ran schema')
	return db
})()

// Ensure we only open the database once
export async function getDb() {
	return dbPromise
}
