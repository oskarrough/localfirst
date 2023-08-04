import {c, html} from 'atomico'

import './components/r4-channels.js'
import './components/r4-tracks.js'
import './components/r4-matrix.js'

function LocalFirst() {
	return html`<host>
		<p>Hello local first. <visit-counter></visit-counter></p>
		<h2>Channels</h2>
		<r4-local-channels></r4-local-channels>
		<h2>Tracks</h2>
		<r4-local-tracks></r4-local-tracks>
	</host>`
}

customElements.define('local-first', c(LocalFirst))
