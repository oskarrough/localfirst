import { c, html, usePromise, useRef, useEffect } from 'atomico'
import { getDb } from './local.js'
import {DataTable} from 'simple-datatables'
import humanizedDate from './humanized-date.js'

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
  if (promise.pending) return html`<host>Loading tracks...</host>`
  return html`<host>error: ${promise.result.message}</host>`
}

customElements.define('r4-tracks', c(component))

function createTable(tableElement, rows) {
  return new DataTable(tableElement, {
    perPageSelect: [10, 50, 100, 200, 500, 1000, 4000],
    perPage: 50,
    columns: [
      {select: 0, hidden: true},
      // {select: 1},
      {select: 2, hidden: true},
      {select: 4, hidden: true},
      {
        select: 5, type: 'date', format: 'ISO_8601', sort: 'desc', 
        render: (data) => humanizedDate(data)
      },
      {select: 6, type: 'date', format: 'ISO_8601', 
        render: (data) => humanizedDate(data)},
    ],
    data: {
      headings: ['Id', 'Channel', 'URL', 'Title', 'Description', 'Created', 'Updated'],
      data: rows
    },
  })
}

