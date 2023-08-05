import {c, html, useState} from 'atomico'
import {createTrack, readTracks} from '../utils/r4-matrix-sdk.js'
import matrix from '@sctlib/mwc/api'

function component({roomId, roomAlias}) {
	const [tracks, setTracks] = useState([])

	const join = () => matrix.joinRoom(roomId)
	const read = () => readTracks(roomId).then(setTracks) //.then(insertTracks(tracks))
	const create = (event) => {
		event.preventDefault()
		const fd = new FormData(event.target)
		createTrack(roomId, {
			slug: roomId,
			url: fd.get('url'),
			title: fd.get('title'),
			description: fd.get('description'),
		})
	}

	return html`<host>
		<button onclick=${join}>Join room</button>
		<button onclick=${read}>Load room tracks</button>
		<hr />
		<form onsubmit=${create}>
			<label for="url">URL</label>
			<input name="url" type="url" required id="url" value="https://www.youtube.com/watch?v=v6B9kXp7fVc" /><br />
			<label for="title">Title</label>
			<input name="title" type="text" required id="title" value=${`Test track ${new Date().getTime()}`} /><br />
			<label for="description">Description</label>
			<textarea name="description" id="description"></textarea><br />
			<button type="submit" name="submit" id="submit" role="primary">Add track to matrix</button>
		</form>
		<hr />
		<matrix-room profile-id=${roomAlias}></matrix-room>
		<ul>
			${tracks.map((track) => html`<li>${track.title}</li>`)}
		</ul>
	</host>`
}

component.props = {
	roomId: String,
	roomAlias: String,
}

customElements.define('r4-matrix', c(component))
