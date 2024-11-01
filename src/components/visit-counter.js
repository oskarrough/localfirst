import { c, html, usePromise } from 'atomico'
import { getDb } from '../db-crsqlite.js'

// Increments the visit count by one.
export async function recordVisit() {
	const db = await getDb()
	const rows = await db.execO(`select count from counters where id = 'visits'`)
	const count = rows[0]?.count || 0
	await db.exec(
		`
    insert into counters (id, count) values (?, ?)
    on conflict(id) do update set count = excluded.count
  `,
		['visits', count + 1]
	)
}

async function getCount() {
	const db = await getDb()
	const rows = await db.execO(`select count from counters where id = 'visits'`)
	return rows[0]?.count
}

function component() {
	const promise = usePromise(getCount)
	if (promise.fulfilled) return html`<host>You've visited this page ${promise.result} times</host>`
	if (promise.pending) return html`<host>You've visited this page...</host>`
	return html`<host>error: ${promise.result.message}</host>`
}

customElements.define('visit-counter', c(component))
