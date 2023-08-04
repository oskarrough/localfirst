// import { getDb } from './local.js'
// import { pullChannels, pullTracks } from './sync.js'

// import initWasm from "@vlcn.io/crsqlite-wasm"
// import wasmUrl from "@vlcn.io/crsqlite-wasm/crsqlite.wasm?url"
// const sqlite = await initWasm(() => wasmUrl)

const initWasm = await import('https://esm.sh/@vlcn.io/crsqlite-wasm@0.14.0')
const sqlite = await initWasm.default(() => "https://esm.sh/@vlcn.io/crsqlite-wasm@0.14.0/dist/crsqlite.wasm");

/**
 * This worker is a demo using SQLite3 via indexeddb a worker thread.
 */

const schema = [
  // 'drop table animals;',
  'create table if not exists animals (name primary key, legs int);',
  'delete from animals;',
  `select crsql_as_crr('animals');`
]


onmessage = async function (event) {
	console.log('main thread says:', event.data)
}

// Prepare
const logTime = (startMs) => ((performance.now() - startMs) / 1000).toFixed(3)
const getDbVersion = async (db) => (await db.exec('select crsql_dbversion()'))[0][0]
const db1 = await sqlite.open('db1.db')
const db2 = await sqlite.open('db2.db')
const logDb = async (dbindex) => {
  const db = dbindex === 1 ? db1 : db2
  console.log(dbindex, await getDbVersion(db), (await db.exec('select name from animals')).toString())
}
const t0 = performance.now()

// DB1
await db1.execMany(schema)
const db1Version = await getDbVersion(db1)
await logDb(1)

// DB 2
await db2.execMany(schema)
const db2Version = await getDbVersion(db2)
await logDb(2)

 // Insert stuff into db1
await db1.exec('insert into animals (name, legs) values (?,?)', ['cat', 4])
await db1.exec('insert into animals (name, legs) values (?,?)', ['blackbird', 2])
await logDb(1)

// And something else into db2
await db2.exec('insert into animals (name, legs) values (?,?)', ['whale', 0])
await logDb(2)

// Get the changesets
const changesets1 = await db1.execA('select * from crsql_changes where db_version > ? AND site_id is null', [db1Version])
const changesets2 = await db2.execA('select * from crsql_changes where db_version > ? AND site_id is null', [db2Version])

// Merge db1 into db2
console.log('applying changesets db1 -> db2', changesets1)
await db2.tx(async (tx) => {
  for (const set of changesets1) {
    await tx.exec('insert into crsql_changes ("table", pk, cid, val, col_version, db_version, site_id) values (?, ?, ?, ?, ?, ?, ?)', set)
  }
})
// await logDb(db2)

// Merge db2 into db1
// console.log('applying changesets db2 -> db1', changesets2)
// await db1.tx(async (tx) => {
//   for (const set of changesets2) {
//     await tx.exec('insert into crsql_changes ("table", pk, cid, val, col_version, db_version, site_id) values (?, ?, ?, ?, ?, ?, ?)', set)
//   }
// })
// await logDb(db1)
// await logDb(db2)

// const db = await getDb()
// await pullChannels()
// const channels = await db1.execO('select * from channels')
// await db.exec('begin transaction')
// await Promise.all(channels.map(pullTracks))
// await db.exec('commit')
postMessage(`sync done in ${logTime(t0)}s`)
