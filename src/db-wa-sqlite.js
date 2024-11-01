import {channelsTable, tracksTable, settingsTable, testTables} from '../cli/schema'

const dbName = 'test-wasqlite.sqlite3'

// Uncomment one of the following imports to choose which SQLite build
// to use. Note that an asynchronous VFS requires an asynchronous build
// (Asyncify or JSPI). As of 2024-05-26, JSPI is only available behind a flag on Chromium browsers.
// import SQLiteESMFactory from 'wa-sqlite/dist/wa-sqlite.mjs';
import SQLiteESMFactory from 'wa-sqlite/dist/wa-sqlite-async.mjs'
// import SQLiteESMFactory from 'wa-sqlite/dist/wa-sqlite-jspi.mjs';

// Uncomment one of the following imports to choose a VFS. Note that an
// asynchronous VFS requires an asynchronous build, and an VFS using
// FileSystemSyncAccessHandle (generally any OPFS VFS) will run only
// in a Worker.
// import { IDBBatchAtomicVFS as MyVFS } from '../../src/examples/IDBBatchAtomicVFS.js';
// import { OPFSAnyContextVFS as MyVFS } from '../../src/examples/OPFSAnyContextVFS.js';
// import { AccessHandlePoolVFS as MyVFS } from '../src/examples/AccessHandlePoolVFS.js';
// import {OPFSAdaptiveVFS as MyVFS} from 'wa-sqlite/src/examples/OPFSAdaptiveVFS.js'
// import {OPFSAdaptiveVFS as MyVFS} from 'wa-sqlite/src/examples/OriginPrivateFileSystemVFS.js'
// import { OPFSCoopSyncVFS as MyVFS } from '../src/examples/OPFSCoopSyncVFS.js';
// import { OPFSPermutedVFS as MyVFS } from '../src/examples/OPFSPermutedVFS.js';

import * as SQLite from 'wa-sqlite'

const testSql = `
CREATE TABLE IF NOT EXISTS t(x PRIMARY KEY, y);
INSERT OR REPLACE INTO t VALUES ('good', 'bad'), ('hot', 'cold'), ('up', 'down');
SELECT * FROM t;
`.trim()

export async function startSqlite() {
	// Initialize SQLite.
	const module = await SQLiteESMFactory()
	const sqlite3 = SQLite.Factory(module)

	// Register a custom file system.
	// const vfs = await MyVFS.create('hello', module)
	// sqlite3.vfs_register(vfs, true)

	// Open the database.
	const db = await sqlite3.open_v2(dbName)

	const what = await sqlite3.exec(db, testSql, (row, columns) => {
		console.log(row, columns)
	})
	// console.log(what)
	console.log('hmm')

	return db
}

// Handle SQL from the main thread.
// messagePort.addEventListener('message', async (event) => {
// 	const sql = event.data
// 	try {
// 		// Query the database. Note that although sqlite3.exec() accepts
// 		// multiple statements in a single call, this usage is not recommended
// 		// unless the statements are idempotent (i.e. resubmitting them is
// 		// harmless) or you know your VFS will never return SQLITE_BUSY.
// 		// See https://github.com/rhashimoto/wa-sqlite/discussions/171
// 		const results = []
// 		await sqlite3.exec(db, sql, (row, columns) => {
// 			if (columns != results.at(-1)?.columns) {
// 				results.push({columns, rows: []})
// 			}
// 			results.at(-1).rows.push(row)
// 		})
// 		// Return the results.
// )

// const dbPromise = (async () => {
// 	if (globalDb) {
// 		console.log('Reusing cr-sqlite connection')
// 		return globalDb
// 	}
// 	try {
// 		const sqlite = await sqliteWasm(() => wasmUrl)
// 		globalDb = await sqlite.open(dbName)
// 		await globalDb.exec(channelsTable)
// 		await globalDb.exec(tracksTable)
// 		await globalDb.exec(settingsTable)
// 		await globalDb.exec(testTables)
// 		console.log('Opened cr-sqlite and ran schemas')
// 		return globalDb
// 	} catch (error) {
// 		console.error('Error initializing cr-sqlite', error)
// 		throw error
// 	}
// })()

// // Ensure we only open the database once
// export async function getDb() {
// 	return dbPromise
// }

// // Copyright 2024 Roy T. Hashimoto. All Rights Reserved.

// import * as SQLite from '../src/sqlite-api.js';

// const BUILDS = new Map([
//   ['default', '../dist/wa-sqlite.mjs'],
//   ['asyncify', '../dist/wa-sqlite-async.mjs'],
//   ['jspi', '../dist/wa-sqlite-jspi.mjs'],
//   // ['default', '../debug/wa-sqlite.mjs'],
//   // ['asyncify', '../debug/wa-sqlite-async.mjs'],
//   // ['jspi', '../debug/wa-sqlite-jspi.mjs'],
// ]);

// /** @type {Map<string, Config>} */ const VFS_CONFIGS = new Map([
//   {
//     name: 'default',
//     vfsModule: null
//   },
//   {
//     name: 'MemoryVFS',
//     vfsModule: '../src/examples/MemoryVFS.js',
//   },
//   {
//     name: 'MemoryAsyncVFS',
//     vfsModule: '../src/examples/MemoryAsyncVFS.js',
//   },
//   {
//     name: 'IDBBatchAtomicVFS',
//     vfsModule: '../src/examples/IDBBatchAtomicVFS.js',
//     vfsOptions: { lockPolicy: 'shared+hint' }
//   },
//   {
//     name: 'IDBMirrorVFS',
//     vfsModule: '../src/examples/IDBMirrorVFS.js',
//     vfsName: 'demo-mirror'
//   },
//   {
//     name: 'OPFSAdaptiveVFS',
//     vfsModule: '../src/examples/OPFSAdaptiveVFS.js',
//     vfsOptions: { lockPolicy: 'shared+hint' }
//   },
//   {
//     name: 'OPFSAnyContextVFS',
//     vfsModule: '../src/examples/OPFSAnyContextVFS.js',
//     vfsOptions: { lockPolicy: 'shared+hint' }
//   },
//   {
//     name: 'OPFSCoopSyncVFS',
//     vfsModule: '../src/examples/OPFSCoopSyncVFS.js',
//   },
//   {
//     name: 'OPFSPermutedVFS',
//     vfsModule: '../src/examples/OPFSPermutedVFS.js',
//   },
//   {
//     name: 'AccessHandlePoolVFS',
//     vfsModule: '../src/examples/AccessHandlePoolVFS.js',
//   },
//   {
//     name: 'FLOOR',
//     vfsModule: '../src/examples/FLOOR.js',
//   },
// ].map(config => [config.name, config]));

// const searchParams = new URLSearchParams(location.search);

// maybeReset().then(async () => {
//   const buildName = searchParams.get('build') || BUILDS.keys().next().value;
//   const configName = searchParams.get('config') || VFS_CONFIGS.keys().next().value;
//   const config = VFS_CONFIGS.get(configName);

//   const dbName = searchParams.get('dbName') ?? 'hello';
//   const vfsName = searchParams.get('vfsName') ?? config.vfsName ?? 'demo';

//   // Instantiate SQLite.
//   const { default: moduleFactory } = await import(BUILDS.get(buildName));
//   const module = await moduleFactory();
//   const sqlite3 = SQLite.Factory(module);

//   if (config.vfsModule) {
//     // Create the VFS and register it as the default file system.
//     const namespace = await import(config.vfsModule);
//     const className = config.vfsClassName ?? config.vfsModule.match(/([^/]+)\.js$/)[1];
//     const vfs = await namespace[className].create(vfsName, module, config.vfsOptions);
//     sqlite3.vfs_register(vfs, true);
//   }

//   // Open the database.
//   const db = await sqlite3.open_v2(dbName);

//   // Add example functions regex and regex_replace.
//   sqlite3.create_function(
//     db,
//     'regexp', 2,
//     SQLite.SQLITE_UTF8 | SQLite.SQLITE_DETERMINISTIC, 0,
//     function(context, values) {
//       const pattern = new RegExp(sqlite3.value_text(values[0]))
//       const s = sqlite3.value_text(values[1]);
//       sqlite3.result(context, pattern.test(s) ? 1 : 0);
//     },
//     null, null);

//   sqlite3.create_function(
//     db,
//     'regexp_replace', -1,
//     SQLite.SQLITE_UTF8 | SQLite.SQLITE_DETERMINISTIC, 0,
//     function(context, values) {
//       // Arguments are
//       // (pattern, s, replacement) or
//       // (pattern, s, replacement, flags).
//       if (values.length < 3) {
//         sqlite3.result(context, '');
//         return;
//       }
//       const pattern = sqlite3.value_text(values[0]);
//       const s = sqlite3.value_text(values[1]);
//       const replacement = sqlite3.value_text(values[2]);
//       const flags = values.length > 3 ? sqlite3.value_text(values[3]) : '';
//       sqlite3.result(context, s.replace(new RegExp(pattern, flags), replacement));
//     },
//     null, null);

//   // Handle SQL queries.
//   addEventListener('message', async (event) => {
//     try {
//       const query = event.data;

//       const start = performance.now();
//       const results = [];
//       for await (const stmt of sqlite3.statements(db, query)) {
//         const rows = [];
//         while (await sqlite3.step(stmt) === SQLite.SQLITE_ROW) {
//           const row = sqlite3.row(stmt);
//           rows.push(row);
//         }

//         const columns = sqlite3.column_names(stmt)
//         if (columns.length) {
//           results.push({ columns, rows });
//         }
//       }
//       const end = performance.now();

//       postMessage({
//         results,
//         elapsed: Math.trunc(end - start) / 1000
//       })
//     } catch (e) {
//       console.error(e);
//       postMessage({ error: cvtErrorToCloneable(e) });
//     }
//   });

//   // Signal that we're ready.
//   postMessage(null);
// }).catch(e => {
//   console.error(e);
//   postMessage({ error: cvtErrorToCloneable(e) });
// });

// async function maybeReset() {
//   if (searchParams.has('reset')) {
//     const outerLockReleaser = await new Promise(resolve => {
//       navigator.locks.request('demo-worker-outer', lock => {
//         return new Promise(release => {
//           resolve(release);
//         });
//       });
//     });

//     await navigator.locks.request('demo-worker-inner', { ifAvailable: true }, async lock => {
//       if (lock) {
//         console.log('clearing OPFS and IndexedDB');
//         const root = await navigator.storage?.getDirectory();
//         if (root) {
//           // @ts-ignore
//           for await (const name of root.keys()) {
//             await root.removeEntry(name, { recursive: true });
//           }
//         }

//         // Clear IndexedDB.
//         const dbList = indexedDB.databases ?
//           await indexedDB.databases() :
//           ['demo', 'demo-floor'].map(name => ({ name }));
//         await Promise.all(dbList.map(({name}) => {
//           return new Promise((resolve, reject) => {
//             const request = indexedDB.deleteDatabase(name);
//             request.onsuccess = resolve;
//             request.onerror = reject;
//           });
//         }));
//       } else {
//         console.warn('reset skipped because another instance already holds the lock');
//       }
//     });

//     await new Promise((resolve, reject) => {
//       const mode = searchParams.has('exclusive') ? 'exclusive' : 'shared';
//       navigator.locks.request('demo-worker-inner', { mode, ifAvailable: true }, lock => {
//         if (lock) {
//           resolve();
//           return new Promise(() => {});
//         } else {
//           reject(new Error('failed to acquire inner lock'));
//         }
//       });
//     });

//     outerLockReleaser();
//   }
// }

// function cvtErrorToCloneable(e) {
//   if (e instanceof Error) {
//     const props = new Set([
//       ...['name', 'message', 'stack'].filter(k => e[k] !== undefined),
//       ...Object.getOwnPropertyNames(e)
//     ]);
//     return Object.fromEntries(Array.from(props, k =>  [k, e[k]])
//       .filter(([_, v]) => {
//         // Skip any non-cloneable properties.
//         try {
//           structuredClone(v);
//           return true;
//         } catch (e) {
//           return false;
//         }
//       }));
//   }
//   return e;
// }
