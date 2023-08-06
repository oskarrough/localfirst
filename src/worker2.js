import sqlite3InitModule from '@sqlite.org/sqlite-wasm'

/**
 * This worker is a demo using SQLite3 in a worker thread via OPFS
 */

const sqlite3 = await sqlite3InitModule({print: console.log, printErr: console.error})
console.log(`Loaded SQLite ${sqlite3.version.libVersion}`)

const SCHEMA = `
  create table if not exists employees(id, name, salary);
  insert into employees values
    (1, 'Urp', 120),
    (2, 'Osk', 100),
    (3, 'Ida', 80);
`

const db = getDb(sqlite3)
db.exec(SCHEMA)

const rows = query('select * from employees')
console.log(rows)









// Shortcuts
function getDb(sqlite3) {
	let db
	if ('opfs' in sqlite3) {
		db = new sqlite3.oo1.OpfsDb('/mydb.sqlite3')
		console.log('OPFS is available, created persisted database at', db.filename)
	} else {
		db = new sqlite3.oo1.DB('/mydb.sqlite3', 'ct')
		console.log('OPFS is not available, created transient database', db.filename)
	}
	return db
}
function query(sql) {
	return db.selectObjects(sql)
}
