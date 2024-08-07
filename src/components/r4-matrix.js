import {c, html, useState} from 'atomico'
import {createTrack, readTracks} from '../utils/r4-matrix-sdk.js'
import matrix from '@sctlib/mwc/api'

function component({roomId, roomAlias}) {
	const [tracks, setTracks] = useState([])
	const [needsConsent, setNeedsConsent] = useState(false)

	const join = async () => {
		const res = await matrix.joinRoom(roomId)
		if (res.errcode === 'M_CONSENT_NOT_GIVEN') {
			setNeedsConsent(res.error)
		}
	}

	const read = () => readTracks(roomId).then(setTracks) //.then(insertTracks(tracks))

	const create = async (event) => {
		event.preventDefault()
		const fd = new FormData(event.target)
		try {
			const res = await createTrack(roomId, {
				slug: roomId,
				url: fd.get('url'),
				title: fd.get('title'),
				description: fd.get('description'),
			})
			if (res.error) throw res
		} catch (err) {
			console.log(err)
		}
	}

	return html`<host>
		<h3>Matrix controls</h3>
		<p><label>Room ID (readonly for now) <input readonly value=${roomId} /></label></p>
		<menu>
			<button onclick=${join}>Join room</button>
			<button onclick=${read}>Preview room tracks</button>
		</menu>
		${needsConsent && html`<p>${needsConsent}</p>`}
		<ul>
			${tracks.map((track) => html`<li>${track.title}</li>`)}
		</ul>
		<h3>Create track on Matrix</h3>
		<form onsubmit=${create}>
			<label for="url">URL</label>
			<input name="url" type="url" required id="url" value="https://www.youtube.com/watch?v=v6B9kXp7fVc" /><br />
			<label for="title">Title</label>
			<input name="title" type="text" required id="title" value=${`Test track ${new Date().getTime()}`} /><br />
			<button type="submit" name="submit" id="submit" role="primary">Add track to matrix</button>
		</form>
	</host>`
}

component.props = {
	roomId: String,
	roomAlias: String,
}

customElements.define('r4-matrix', c(component))
