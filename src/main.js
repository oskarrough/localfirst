import { sqlite3Worker1Promiser } from '@sqlite.org/sqlite-wasm';

const log = console.log;
const error = console.error;

// const factory = await sqlite3Worker1Promiser.v2(/*optional config*/);

const initializeSQLite = async () => {
	try {
		log('Loading and initializing SQLite3 module...');

		const promiser = await new Promise((resolve) => {
			const _promiser = sqlite3Worker1Promiser({
				onready: () => resolve(_promiser),
			});
		});

		log('Done initializing. Running demo...');

		const configResponse = await promiser('config-get', {});
		log('Running SQLite3 version', configResponse.result.version.libVersion);

		const openResponse = await promiser('open', {
			filename: 'file:mydb.sqlite3?vfs=opfs',
		});
		const { dbId } = openResponse;
		log(
			'OPFS is available, created persisted database at',
			openResponse.result.filename.replace(/^file:(.*?)\?vfs=opfs$/, '$1'),
		);
		console.log(openResponse)
		// Your SQLite code here.
	} catch (err) {
		if (!(err instanceof Error)) {
			err = new Error(err.result.message);
		}
		error(err.name, err.message);
	}
};



// import {makeWorker} from './spawn-workers.js'
// import {initializeSQLite, db} from './worker.js'
// import './ui.js'
// import {recordVisit} from './components/visit-counter.js'
// Increment the visit counter by 1
// recordVisit()

// import * as Comlink from 'comlink'

async function main() {
	initializeSQLite()
	// const worker = new Worker(new URL('worker.js', import.meta.url), {type: 'module'})
	// const initializeSQLite = Comlink.wrap(worker)
	// await initializeSQLite()
	// testConnection(db)
}

main()

// export function makeWorker(file) {

// window.localfirstworker = worker
// console.log('spawned worker. Tip: access the worker on window.localfirstworker', worker)

// await initializeSQLite()

async function testConnection(db) {
	console.log('test')
	const tables = db.selectObjects("SELECT name FROM sqlite_master WHERE type='table';")
	console.table(tables)
}

// test()

// // function insertTestRow(name, legs) {
// // 	db.exec({
// // 		sql: 'insert into animals (id, name, legs) values (?, ?,?)',
// // 		bind: [createId(), name, legs]
// // 	})
// // }

// // db.exec('drop table animals')
// // db.exec('create table if not exists animals (id primary key, name, legs int)')

// // insertTestRow('cat', 4)
// // insertTestRow('t-rex', 2)
// // const animals = db.selectObjects('select * from animals')
// // console.table(animals)

