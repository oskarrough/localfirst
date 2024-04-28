import sqliteWasm from '@vlcn.io/crsqlite-wasm'
import wasmUrl from '@vlcn.io/crsqlite-wasm/crsqlite.wasm?url'
import {schema} from './schemas.js'

// Singleton promise.
const dbPromise = (async () => {
	const sqlite = await sqliteWasm(() => wasmUrl)
	const db = await sqlite.open('my.db')
	await db.exec(schema)
	console.log('executed schema on local database')
	return db
})()

// Ensure we only open the database once
export async function getDb() {
	return dbPromise
}
