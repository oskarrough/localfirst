import sqliteWasm from '@vlcn.io/crsqlite-wasm'
import wasmUrl from '@vlcn.io/crsqlite-wasm/crsqlite.wasm?url'
// import tblrx from '@vlcn.io/rx-tbl'
import {nanoid} from 'nanoid'

const schema = `
  --drop table tracks;
	create table if not exists channels(id primary key, name, slug unique, created_at);
	create table if not exists tracks(id primary key, slug not null, url, title, description, created_at, updated_at, foreign key(slug) references channels(slug));
  create table if not exists counters(id primary key, count integer);
`

let db

export async function getDb() {
  // console.log('getdb', db)
  if (db) return db
	const sqlite = await sqliteWasm(() => wasmUrl)
	db = await sqlite.open('my_database.db')
  // const db = await sqlite.open(":memory:")
  await db.exec(schema)
  return db
}

async function recordVisit() {
  const db = await getDb()
  const id = 'visits'
  const rows = await db.execO(`select count from counters where id = ?`, [id])
  let count = rows[0]?.count
  if (!count) {
    await db.exec(`insert into counters (id, count) values (?, ?)`, [id, 0])
    count = 0
  }
  count = count + 1
  await db.exec(`update counters set count = ? where id = ?`, [count, id])
  return count
}

recordVisit()


// setTimeout(getDb, 2000)

// Watch for changes aka reactivity
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


















// observable version

// created = db.execMany([
//   `CREATE TABLE IF NOT EXISTS todo_list ("name" primary key, "creation_time");`,
//   `CREATE TABLE IF NOT EXISTS todo ("id" primary key, "list", "text", "complete");`
//   // primary keys act as the identifier by which to merge.
//   // if two things have different primary keys, they'll both exist.
//   // if two things have the same primary key, their contents are merged.
// ])
// upgraded = created == OK && // "created == OK" is to tell observable not to run this cell until the one above has run
//   db.execMany([
//     `SELECT crsql_as_crr('todo_list');`,
//     `SELECT crsql_as_crr('todo');`
//   ])
// inserted = {
//   upgraded == OK;
//   let list = [
//     "milk",
//     "potatos",
//     "avocado",
//     "butter",
//     "cheese",
//     "broccoli",
//     "spinach"
//   ];
//   // `insert or ignore` given this is a notebook and ppl will re-run cells.
//   await db.exec(`INSERT OR IGNORE INTO todo_list VALUES ('groceries', ?)`, [
//     Date.now()
//   ]);
//   await Promise.all(
//     list.map((item) =>
//       db.exec(`INSERT INTO todo VALUES (?, 'groceries', ?, 0)`, [
//         nanoid.nanoid(),
//         item
//       ])
//     )
//   );

//   list = ["test", "document", "explain", "onboard", "hire"];
//   await db.exec(`INSERT OR IGNORE INTO todo_list VALUES ('work', ?)`, [
//     Date.now()
//   ]);
//   await Promise.all(
//     list.map((item) =>
//       db.exec(`INSERT INTO todo VALUES (?, 'work', ?, 0)`, [
//         nanoid.nanoid(),
//         item
//       ])
//     )
//   );
//   return OK;
// }

// {
//   inserted == OK;
//   const groceries = await db.execO(
//     `SELECT "list", "text" FROM "todo" WHERE "list" = 'groceries'`
//   );
//   return Inputs.table(groceries);
// }

// changesets = {
//   inserted == OK;
//   return await db.execA("SELECT * FROM crsql_changes where db_version > -1");
// }

// db2 = {
//   changesets;
//   const db2 = await sqlite.open(":memory:");
//   await db2.execMany([
//     `CREATE TABLE IF NOT EXISTS todo_list ("name" primary key, "creation_time");`,
//     `CREATE TABLE IF NOT EXISTS todo ("id" primary key, "list", "text", "complete");`,
//     `SELECT crsql_as_crr('todo_list');`,
//     `SELECT crsql_as_crr('todo');`
//   ]);

//   return db2;
// }

// merged = {
//   await db2.tx(async (tx) => {
//     for (const cs of changesets) {
//       await tx.exec(
//         `INSERT INTO crsql_changes VALUES (?, ?, ?, ?, ?, ?, ?)`,
//         cs
//       );
//     }
//   });
//   return OK;
// }

// {
//   merged == OK;
//   const work = await db2.execO(
//     `SELECT "list", "text" FROM "todo" WHERE "list" = 'work'`
//   );
//   return Inputs.table(work);
// }
