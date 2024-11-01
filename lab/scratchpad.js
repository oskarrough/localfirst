
// async function pull(db) {
// 	// @todo make this configurable in the settings for remote matrix. This is current #r4radiotest123:matrix.org
// 	const MATRIX_TEST_ROOM_ID = '!aGwogbKehPpaWCGFIf:matrix.org'
// 	const t0 = performance.now()
// 	const settings = await getSettings()
// 	const remotes = []
// 	if (settings.provider_r4) remotes.push(new R4Remote(db))
// 	if (settings.provider_matrix) remotes.push(new MatrixRemote(db, {roomId: MATRIX_TEST_ROOM_ID}))
// 	// await db.exec('begin transaction')
// 	await Promise.all(remotes.map((r) => r.pull()))
// 	// await db.exec('commit')
// 	console.log(`worker: pulled in ${secondsSince(t0)}s`)
// }

// async function deleteAll(db) {
// 	try {
// 		await db.exec('delete from settings; delete from channels; delete from tracks;')
// 		console.log('deleted settings, channels and tracks')
// 		const what = await db.selectObjects('select * from channels;')
// 		console.log(what)
// 	} catch (err) {
// 		console.log('failed to dump')
// 		console.log(err)
// 		console.error(err)
// 	}
// }

// async function getSettings(db) {
// 	return await db.selectObjects('select * from settings where id = 1')[0]
// }

// async function sync() {
//   console.log('worker: syncing...')
//   // const s = await getSettings()
//   // console.log(s)
// 	const t0 = performance.now()
// 	const db = await getDb()
// 	const remotes = [
// 		new R4Remote(db),
// 		new MatrixRemote(db, {roomId: ROOM_ID})
// 	]
// 	// await db.exec('begin transaction')
// 	await Promise.all(remotes.map((r) => r.pull()))
// 	// await db.exec('commit')
// 	console.log(`sync done in ${secondsSince(t0)}s`)
// }

// async function dump() {
//   await (await getDb()).exec('delete from channels; delete from tracks;')
//   console.log('worker: dumped')
// }
