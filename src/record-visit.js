import { getDb } from './local.js'

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
