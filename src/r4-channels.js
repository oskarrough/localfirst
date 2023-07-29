import { c, html, css, usePromise, useRef, useEffect } from 'atomico'
import { getDb } from './local.js'
import {DataTable} from 'simple-datatables'
import humanizedDate from './humanized-date.js'

// Note, we use execA to get an array of columns, not objects.
const getChannels = () => getDb().then((db) => db.execA('select * from channels'))

function component() {
  const ref = useRef()
  const promise = usePromise(getChannels, [])

  useEffect(() => {
    const {current} = ref
    if (current && promise.fulfilled) createTable(current, promise.result)
  })

  if (promise.fulfilled) return html`<host><table ref=${ref}></table></host>`
  if (promise.pending) return html`<host>loading</host>`
  return html`<host>error: ${promise.result.message}</host>`
}

customElements.define('r4-channels', c(component))

function createTable(tableElement, rows) {
  return new DataTable(tableElement, {
    perPageSelect: [10, 50, 100, 200, 500, 1000, 4000],
    perPage: 50,
    columns: [
      {select: 0, hidden: true},
      {select: 1, render(data) {
        return `<a href="#">${data[0].data}</a>`
      }},
      {
        // select the fourth column ...
        select: 3,
        // ... let the instance know we have datetimes in it ...
        type: 'date',
        // ... pass the correct datetime format ...
        // format: 'MMYYYY/DD/MM',
        // ... sort it ...
        sort: 'desc',
        render: (data) => humanizedDate(data),
      },
    ],
    data: {
      headings: ['Id', 'Name', 'Slug', 'Created Date'],
      data: rows
    },
  })
}

