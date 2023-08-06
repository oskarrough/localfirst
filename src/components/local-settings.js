import {c, html, useState} from 'atomico'
import {worker} from '../main.js'

async function sync() {
  await worker.sync()
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

function smartButton({label, labeling, action}) {
  const [loading, setLoading] = useState(false)
  const doAction = async () => {
    setLoading(true)
    await action()
    setLoading(false)
  }
  return html`<host>
    <button disabled=${loading} onclick=${doAction}>${!loading ? label : labeling}</button>
    </host>`
}
smartButton.props = {
  label: String,
  labeling: String,
  action: Function
}
customElements.define('smart-button', c(smartButton))

function component() {
	return html`<host>
		<h3>Local settings</h3>
		<menu>
			<smart-button action=${sync} label="Sync" labeling="Syncing" />
			<smart-button action=${dump} label="Dump" labeling="Dumping" />
			<button onclick=${getDatabaseFile}>Download sqlite db</button>
      <a href="/">Reload</a>
		</menu></host>`
}

customElements.define('local-settings', c(component))

