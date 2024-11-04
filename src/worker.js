import * as Comlink from 'comlink'
// import { startSqlite } from './db-wa-sqlite'
import {initializeSqlite} from './db-sqlite'

// Do not put async stuff at the top level!

console.log('worker.js', Date.now())

const testSql = `
CREATE TABLE IF NOT EXISTS t(x PRIMARY KEY, y);
INSERT OR REPLACE INTO t VALUES ('good', 'bad'), ('hot', 'cold'), ('up', 'down');
SELECT * FROM t;
`.trim()

async function hey() {
	console.log('worker.js hey')
	const db = await initializeSqlite()
	await db.exec(testSql)
	const results = await db.selectObjects('select * from t;')
	console.log(results)
}

const obj = {
	counter: 0,
	hey,
	inc() {
		this.counter++
	},
}

Comlink.expose(obj)
postMessage({ready: true})
