import sqlite3InitModule from '@sqlite.org/sqlite-wasm'

/**
 * This worker is a demo using SQLite3 in a worker thread via OPFS
 */

const log = (...args) => console.log(...args)
const error = (...args) => console.error(...args)

const start = function (sqlite3) {
	log('Running SQLite3 version', sqlite3.version.libVersion)
	let db
	if ('opfs' in sqlite3) {
		db = new sqlite3.oo1.OpfsDb('/mydb.sqlite3')
		log('OPFS is available, created persisted database at', db.filename)
	} else {
		db = new sqlite3.oo1.DB('/mydb.sqlite3', 'ct')
		log('OPFS is not available, created transient database', db.filename)
	}
	return db
}

log('Loading and initializing SQLite3 module...')

const sqlite3 = await sqlite3InitModule({
	print: log,
	printErr: error,
})

log('Done initializing. Running demo...')

try {
	const db = start(sqlite3)
	db.exec('create table if not exists animals(name text unique, legs int)')
	
	db.exec([
		'drop table foo;',
		'create table foo (a primary key, b);',
		'insert into foo values (1, 2);'
	])

	// db.exec({sql: 'insert into animals (name, legs) values (?, ?)', bind: ['cat', 4]})
	// db.exec({sql: 'insert into animals (name, legs) values (?, ?)', bind: ['dog', 4]})
	// db.exec({sql: 'insert into animals (name, legs) values (?, ?)', bind: ['eagle', 2]})
	const rows = []
	db.exec({sql: 'select * from foo', resultRows: rows, rowMode: 'object'})
	log('got rows?', rows)
	db.close()
	// postMessage({type: 'db', data: db})
} catch (err) {
	error(err.name, err.message)
}

