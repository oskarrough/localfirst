import { c, html } from 'atomico'

import './components/r4-channels.js'
import './components/r4-tracks.js'

function LocalFirst() {
	return html`<host>
		<p>Hello local first. <visit-counter></visit-counter></p>
		<h2>Channels</h2>
		<r4-channels></r4-channels>
		<h2>Tracks</h2>
		<r4-tracks></r4-tracks>
	</host>`
}

customElements.define('local-first', c(LocalFirst))
