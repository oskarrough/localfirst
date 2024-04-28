import { c, html, usePromise, useRef, useEffect } from 'atomico'
import { DataTable } from 'simple-datatables'
import { getDb } from '../local-db.js'
import humanizedDate from '../utils/humanized-date.js'

// Note, we use execA to get an array of columns, not objects.
const getChannels = () => getDb().then((db) => db.execA('select * from channels'))

function component() {
	const ref = useRef()
	const promise = usePromise(getChannels, [])

	useEffect(() => {
		const { current } = ref
		if (current && promise.fulfilled) createTable(current, promise.result)
	})

	if (promise.fulfilled) return html`<host><table ref=${ref}></table></host>`
	if (promise.pending) return html`<host><p>Loading...</p></host>`
	return html`<host>error: ${promise.result.message}</host>`
}

customElements.define('r4-local-channels', c(component))

function createTable(tableElement, rows) {
	console.log('create channel table', rows)
	return new DataTable(tableElement, {
		// perPageSelect: [10, 50, 100, 200, 500, 1000, 4000],
		perPage: 5,
		columns: [
			{ select: 0, hidden: false },
			{ select: 1 },
			{ select: 2 },
			{ select: 3, hidden: false }, // description
			// { select: 4, hidden: true }, // updated_at
			{
				select: 5,
				type: 'date',
				// format: 'MMYYYY/DD/MM',
				sort: 'desc',
				render: (data) => humanizedDate(data),
				cellClass: 'date',
			},
		],
		data: {
			headings: ['Id', 'Name', 'Slug', 'Description', 'Updated', 'Created'],
			data: rows,
		},
	})
}
