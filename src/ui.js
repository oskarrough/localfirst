import {c, html} from 'atomico'
import {worker} from './main.js'

import './components/r4-channels.js'
import './components/r4-tracks.js'
import './components/r4-matrix.js'

function LocalFirst() {
	
	const sync = () => worker.postMessage('sync')

	return html`<host>
		<p>Hello local first. <visit-counter></visit-counter></p>
		
		<menu><button onclick=${sync}>Sync</button></menu>

		<r4-matrix room-id="!aGwogbKehPpaWCGFIf:matrix.org" room-alias="#r4radiotest123:matrix.org"></r4-matrix>
		<h2>Local Channels</h2>
		<r4-local-channels></r4-local-channels>
		<h2>Local Tracks</h2>
		<r4-local-tracks></r4-local-tracks>
	</host>`
}

customElements.define('local-first', c(LocalFirst))
