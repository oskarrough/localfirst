import {c, html} from 'atomico'
import {worker} from '../spawn-workers.js'

async function pull() {
	await worker.pull()
}
async function dump() {
	await worker.dump()
}

// https://web.dev/origin-private-file-system/#accessing-existing-files-and-folders
async function getDatabaseFile() {
	try {
		const opfsRoot = await navigator.storage.getDirectory()
		// Name has to match the one in worker2.js
		const fileHandle = await opfsRoot.getFileHandle('mydb.sqlite3')
		const fileData = await fileHandle.getFile()
		const handle = await window.showSaveFilePicker({
			suggestedName: fileData.name,
		})
		const writable = await handle.createWritable()
		await writable.write(fileData)
		await writable.close()
	} catch (error) {
		if (error.name !== 'AbortError') {
			console.error(error.name, error.message)
		}
	}
}

function component() {
	return html`<host>
		<menu>
			<async-button action=${pull} label="Pull" labeling="Pull" />
			<button disabled title="@todo">Push</button>
			<async-button action=${dump} label="Dump local db" labeling="Dumping" />
			<button onclick=${getDatabaseFile}>Download local db</button>
			<button onclick=${() => window.location = '/'}>Reload page</button>
		</menu></host
	>`
}

customElements.define('local-settings', c(component))
