// https://observablehq.com/@tantaman/cr-sqlite-basic-setup
// https://vlcn.io/docs/js/persistence

import initWasm from "@vlcn.io/crsqlite-wasm";
import wasmUrl from "@vlcn.io/crsqlite-wasm/crsqlite.wasm?url";
import { nanoid } from "nanoid";

export async function getDb() {
  const sqlite = await initWasm(() => wasmUrl)
  return await sqlite.open("my_database.db")
}

async function main() {
  const db = await getDb()

  // await db.exec('drop table users')
  await db.exec("CREATE TABLE if not exists users (id PRIMARY KEY, name, created)");

  const rows = await db.execO('select id, name from users')
  console.log(rows)

  //   const groceries = await db.execO(
  //     `SELECT "list", "text" FROM "todo" WHERE "list" = 'groceries'`
  //   );
  await db.exec(`INSERT INTO users VALUES (?, 'anon', ?)`, [nanoid(), new Date().getTime()])
}

main()

// console.log(await db.exec('select * from users'))

// const list = [
//   "milk",
//   "potatos",
//   "avocado",
//   "butter",
//   "cheese",
//   "broccoli",
//   "spinach"
// ];

// await Promise.all(
//   list.map((item) =>
//     db.exec(`INSERT INTO todo VALUES (?, 'groceries', ?, 0)`, [
//       nanoid.nanoid(),
//       item
//     ])
// )
// );

// observable version

// sqliteWasm = import("https://esm.sh/@vlcn.io/crsqlite-wasm@0.14.0")
// sqlite = sqliteWasm.default(
//   (file) => "https://esm.sh/@vlcn.io/crsqlite-wasm@0.14.0/dist/crsqlite.wasm"
// )
// db = sqlite.open(":memory:")
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
