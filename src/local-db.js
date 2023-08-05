// NPM usage
import sqliteWasm from '@vlcn.io/crsqlite-wasm'
import wasmUrl from '@vlcn.io/crsqlite-wasm/crsqlite.wasm?url'
// CDN usage
// const sqliteWasm = await import('https://esm.sh/@vlcn.io/crsqlite-wasm@0.14.0')
// const sqlite = await sqliteWasm.default(() => 'https://esm.sh/@vlcn.io/crsqlite-wasm@0.14.0/dist/crsqlite.wasm')

const schema = `
	create table if not exists channels(id primary key, name, slug unique, created_at);
	create table if not exists tracks(id primary key, slug not null, url, title, description, created_at, updated_at, foreign key(slug) references channels(slug) on delete cascade);
  create table if not exists counters(id primary key, count integer);
  --select crsql_as_crr('channels');
  --select crsql_as_crr('tracks');
`

export async function getDb() {
  const sqlite = await sqliteWasm(() => wasmUrl)
  const db = await sqlite.open('my.db')
  await db.exec(schema)
  return db
}
