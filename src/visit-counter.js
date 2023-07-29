import { c, html, usePromise } from 'atomico'
import { getDb } from './local.js'

async function getCount() {
	const db = await getDb()
	const rows = await db.execO(`select count from counters where id = 'visits'`)
	return rows[0]?.count
}

function component() {
	const promise = usePromise(getCount)
	if (promise.fulfilled) return html`<host>Total visits: ${promise.result}</host>`
	if (promise.pending) return html`<host>Total visits: loading...</host>`
	return html`<host>error: ${promise.result.message}</host>`
}

customElements.define('visit-counter', c(component))
