import {getDb} from './local.js'

export async function recordVisit() {
  const db = await getDb()
  const id = 'visits'
  // Get or create a count.
  const rows = await db.execO(`select count from counters where id = ?`, [id])
  let count = rows[0]?.count
  if (!count) {
    await db.exec(`insert into counters (id, count) values (?, ?)`, [id, 0])
    count = 0
  }
  // Update count.
  count = count + 1
  await db.exec(`update counters set count = ? where id = ?`, [count, id])
  return count
}

