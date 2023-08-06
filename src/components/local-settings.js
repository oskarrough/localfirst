import {c, html} from 'atomico'
import {worker} from '../main.js'

function sync() {
	return worker.postMessage('sync')
}
function dump() {
	return worker.postMessage('dump')
}

// https://web.dev/origin-private-file-system/#accessing-existing-files-and-folders
async function getDatabaseFile() {
	try {
		const opfsRoot = await navigator.storage.getDirectory()
		// Name has to match the one in worker2.js
		const fileHandle = await opfsRoot.getFileHandle('mydb.sqlite3')
		const fileData = await fileHandle.getFile()
		const handle = await showSaveFilePicker({
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
		<h3>Local settings</h3>
		<menu>
			<button onclick=${sync}>Sync</button>
			<button onclick=${dump}>Dump</button>
			<button onclick=${getDatabaseFile}>Download db</button>
		</menu></host>`
}

customElements.define('local-settings', c(component))
