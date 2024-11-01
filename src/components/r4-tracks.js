import {c, html, usePromise, useRef, useEffect} from 'atomico'
import {DataTable} from 'simple-datatables'
import {getDb} from '../db-crsqlite.js'
import humanizedDate from '../utils/humanized-date.js'

// Note, we use execA to get an array of columns, not objects.
const getAllTracks = () => getDb().then((db) => db.execA('select * from tracks'))
// const getTracks = (slug) => getDb().then((db) => db.execA('select * from tracks where slug = ?', [slug]))

function component() {
	const ref = useRef()
	const promise = usePromise(getAllTracks, [])
	useEffect(() => {
		const {current} = ref
		if (current && promise.fulfilled) createTable(current, promise.result)
	})
	if (promise.fulfilled) return html`<host><table ref=${ref}></table></host>`
	if (promise.pending) return html`<host><p>Loading...</p></host>`
	return html`<host>error: ${promise.result.message}</host>`
}

customElements.define('r4-local-tracks', c(component))

/**
 * @param {HTMLTableElement} tableElement
 * @param {import('../cli/schema.js').Track[]} rows
 */
function createTable(tableElement, rows) {
	return new DataTable(tableElement, {
		data: {
			headings: ['Id', 'Channel', 'URL', 'Title', 'Description', 'Created', 'Updated'],
			data: rows,
		},
		perPageSelect: [10, 50, 100, 200, 500, 1000, 4000],
		perPage: 10,
		columns: [
			{select: 0, hidden: true},
			{select: 2, hidden: true},
			{select: 4, hidden: true},
			{
				select: 5,
				type: 'date',
				format: 'ISO_8601',
				sort: 'desc',
				// render: (data) => humanizedDate(data),
				cellClass: 'date',
			},
			{
				select: 6,
				type: 'date',
				format: 'ISO_8601',
				render: (data) => humanizedDate(data),
				cellClass: 'date',
			},
		],
	})
}
