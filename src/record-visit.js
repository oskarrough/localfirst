import {getDb} from './local.js'

async function recordVisit() {
  const db = await getDb()
  const id = 'visits'
  const rows = await db.execO(`select count from counters where id = ?`, [id])
  let count = rows[0]?.count
  if (!count) {
    await db.exec(`insert into counters (id, count) values (?, ?)`, [id, 0])
    count = 0
  }
  count = count + 1
  await db.exec(`update counters set count = ? where id = ?`, [count, id])
  return count
}

recordVisit()

