import sqliteWasm, {DB} from '@vlcn.io/crsqlite-wasm'
import wasmUrl from '@vlcn.io/crsqlite-wasm/crsqlite.wasm?url'

const schema = `
	create table if not exists channels(id primary key, name, slug unique, created_at);
	create table if not exists tracks(id primary key, slug not null, url, title, description, created_at, updated_at, foreign key(slug) references channels(slug) on delete cascade);
  create table if not exists counters(id primary key, count integer);
  --select crsql_as_crr('channels');
  --select crsql_as_crr('tracks');
`

// Singleton promise.
const dbPromise = (async () => {
	const sqlite = await sqliteWasm(() => wasmUrl)
	const db = await sqlite.open('my.db')
	await db.exec(schema)
	return db
})()

// Ensure we only open the database once
export async function getDb() {
	return dbPromise
}
