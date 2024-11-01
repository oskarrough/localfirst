import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBackup} from '../../cli/utils.js'
// import {hello} from './sqlite-browser.js'
import TheTable from './the-table'
import './index.css'

async function main() {
	// await hello()
	// await setupSQLite()

	const {data, error} = await createBackup('oskar')
	if (error) {
		console.error(error)
		throw new Error('Failed to fetch backup')
	}

	ReactDOM.createRoot(document.getElementById('radio-table-react')!).render(
		<React.StrictMode>
			<TheTable store={data} />
		</React.StrictMode>
	)
}

main()
