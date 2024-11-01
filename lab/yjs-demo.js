import { c, html } from 'atomico'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

const ydoc = new Y.Doc()

// what dos this do?
ydoc.on('update', update => {
	console.log('got an update', update)
})

const radio = new Y.Map()


// this allows you to instantly get the (cached) documents data
// const indexeddbProvider = new IndexeddbPersistence('count-demo', ydoc)
// indexeddbProvider.whenSynced.then(() => {
//   console.log('loaded data from indexed db')
// })

// Sync clients with the y-webrtc provider.
// const webrtcProvider = new WebrtcProvider('count-demo', ydoc)

// Sync clients with the y-websocket provider
// const websocketProvider = new WebsocketProvider(
//   'wss://demos.yjs.dev', 'count-demo', ydoc
// )
// wss://ystream.yjs.dev
// array of numbers which produce a sum
const yarray = ydoc.getArray('count')

// observe changes of the sum
yarray.observe(event => {
	// print updates when the data changes
	console.log('new sum: ' + yarray.toArray().reduce((a, b) => a + b))
})

// add 1 to the sum
yarray.push([1]) // => "new sum: 1"

function YjsDemo() {
	return html`<host>
		<h1>hey yjs</h1>
		<label>What's good? <input type="text" /></label>
	</host>`
}

customElements.define('yjs-demo', c(YjsDemo))

