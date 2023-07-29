import sqliteWasm from '@vlcn.io/crsqlite-wasm'
import wasmUrl from '@vlcn.io/crsqlite-wasm/crsqlite.wasm?url'

const schema = `
  --drop table tracks;
	create table if not exists channels(id primary key, name, slug unique, created_at);
	create table if not exists tracks(id primary key, slug not null, url, title, description, created_at, updated_at, foreign key(slug) references channels(slug) on delete cascade);
  create table if not exists counters(id primary key, count integer);

  --select crsql_as_crr('channels');
  --select crsql_as_crr('tracks');
`

let db

export async function getDb() {
  if (db) return db
	const sqlite = await sqliteWasm(() => wasmUrl)
  // db = await sqlite.open(":memory:")
	db = await sqlite.open('my_database.db')
  await db.exec(schema)
  return db
}

// Watch for changes aka reactivity
// import tblrx from '@vlcn.io/rx-tbl'
// const rx = tblrx(db);
// const disposable = rx.onRange(["channels"], (updateTypes) => {
//   console.log("channels changed", updateTypes);
// });
// disposable(); // unsubscribe the `onRange` listener
// rx.onAny(() => {
//   console.log('db had some change');
// });
// rx.onPoint("channels", "xyz", (updateTypes) => {
//   console.log("channel with id xyz changed", updateTypes);
// });
// rx.dispose(); // uninstall the rx layer

// globalThis.onbeforeunload = () => {
//   return db.close()
// }
