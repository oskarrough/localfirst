import {c, html} from 'atomico'
// import {worker} from '../spawn-workers.js'

async function pull() {
	await worker.pull()
}

async function deleteAll() {
	// await worker.exec('delete from channels')
	await worker.deleteAll()
	console.log('deleted all channels')
}

// https://web.dev/origin-private-file-system/#accessing-existing-files-and-folders
async function getDatabaseFile() {
	try {
		const opfsRoot = await navigator.storage.getDirectory()
		// Name has to match the one in worker.js
		const fileHandle = await opfsRoot.getFileHandle('mydb2.sqlite3')
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
		<h3>Local settings</h3>
		<menu>
			<async-button action=${pull} label="Pull from remotes" labeling="Pulling" />
			<async-button action=${deleteAll} label="Delete local data" labeling="Deleting" />
			<button onclick=${getDatabaseFile}>Download sqlite db</button>
			<a href="/">Reload page</a>
		</menu>
	</host>`
}

customElements.define('local-settings', c(component))
