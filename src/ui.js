import {c, html, usePromise} from 'atomico'

import '@sctlib/mwc/raw'
import api from '@sctlib/mwc/api'

import './components/async-button.js'
import './components/r4-channels.js'
import './components/r4-tracks.js'
import './components/r4-matrix.js'
import './components/local-settings.js'

// import {worker} from './spawn-workers.js'

async function getSettings() {
	console.log('@todo')
	// return (await worker.query('select * from settings where id = 1'))[0]
}

const setRemotes = async (event) => {
	event.preventDefault()
	const fd = new FormData(event.currentTarget)
	const matrix = fd.get('matrix') ? 1 : 0
	const r4 = fd.get('r4') ? 1 : 0
	const sql = 'UPDATE settings SET provider_matrix = ?, provider_r4 = ? WHERE id = ?'
	const bindValues = [matrix, r4, 1] // 1 and 0 are the new values, and 42 is the user_id
	await worker.exec(sql, {bind: bindValues})
	// toggleRemote('r4', r4)
	// toggleRemote('matrix', r4)
	console.log('updated local settings', await getSettings())
}

function LocalFirst() {
	const promise = usePromise(getSettings, [])

	const onMatrixLogin = async (event) => {
		// event.preventDefault()
		console.log('@todo onlogin', event.detail)
		// const res =  await api.login({user_id: '@donle:matrix.org', password: ".k'2t/uS-4yy"})
		// console.log('second try', res)
	}

	if (promise.pending) return html`<host><p>Loading settings...</p></host>`
	if (!promise.fulfilled) return html`<host>Error loading settings: ${promise.result.message}</host>`
	const settings = promise.result

	return html`<host>
		<h2>Local-First</h2>
		<p>
			This is an experiment in local-first software. When you visit this for the first time, a fresh SQLite database is
			created in your browser.
		</p>

		<hr />

		<h2>Remotes</h2>
		<p>
			The system has the concept of a <em>remote</em>. Remotes are external services that define pull+push methods that
			serialize to the Radio4000 schema. Currently two remotes are supported: Radio4000 and Matrix.
		</p>
		<form onchange=${setRemotes}>
			<fieldset>
				<legend>Enabled remotes</legend>
				<label><input checked=${settings.provider_matrix} type="checkbox" name="matrix" /> Matrix room</label>
				<label><input checked=${settings.provider_r4} type="checkbox" name="r4" /> Radio4000</label>
			</fieldset>
		</form>

		<h2>Local database</h2>
		<p>Sync your local database with the remote services.</p>
		<local-settings></local-settings>

		<details open>
			<h2>Matrix remote</h2>
			<matrix-auth>
				<div slot="login">
					<h2>Sign in to Matrix</h2>
					<matrix-login onuser=${onMatrixLogin}></matrix-login>
				</div>
				<div slot="logout">
					<matrix-logout></matrix-logout>
				</div>
			</matrix-auth>

			<r4-matrix room-id="!aGwogbKehPpaWCGFIf:matrix.org" room-alias="#r4radiotest123:matrix.org"></r4-matrix>

			<h2>Radio4000 remote</h2>
			<p>@todo</p>
		</details>

		<h2>Local Channels</h2>
		<r4-local-channels></r4-local-channels>

		<h2>Local Tracks</h2>
		<r4-local-tracks></r4-local-tracks>
	</host>`
}

customElements.define('local-first', c(LocalFirst))

// async function what() {
// 	// console.log(`testworker2 ${await testWorker.counter}`)
// }
// setTimeout(what, 1000)

// async function toggleRemote(name, disable = false) {
// 	try {
// 		console.log('toggleRemote', name, disable)
// 		await worker.exec(`update settings set provider_${name} = ? where id = 1`)
// 	} catch (err) {
// 		console.log(err)
// 	}
// }
