import matrix from '@sctlib/mwc/api'

/** @typedef {import('./types.js').Track} Track */

// A custom event type for our track events in Matrix
const EVENT_TYPE_TRACK = 'org.r4.track'

/**
 * Reads all tracks from a matrix room and returns them, serialized
 * @param {string} roomId
 * @returns {Promise<Array<Track>>}
 */
export async function readTracks(roomId) {
	let tracks = []
	try {
		await matrix.joinRoom(roomId)
		const res = await matrix.getRoomMessages({
			roomId,
			limit: 5000,
			params: [['filter', JSON.stringify({types: [EVENT_TYPE_TRACK]})]],
		})
		if (res.error) throw res
		tracks = res.chunk.map(serializeMatrixTrack)
	} catch (err) {
		if (err.errcode === 'M_FORBIDDEN') {
			await matrix.joinRoom(roomId)
			throw new Error('You are not allowed to read this room')
		}
		console.log(err)
	} finally {
		return tracks
	}
}

/**
 * Creates a new track in a Matrix room
 * @param {string} roomId
 * @param {{url: string, title: string, description?: string}} track
 */
export async function createTrack(roomId, track) {
	if (!roomId) throw new Error('Missing roomId to create track')
	const event = {
		room_id: roomId,
		event_type: EVENT_TYPE_TRACK,
		content: JSON.stringify(track),
	}
	try {
		console.log('↑ 1 track to matrix', event)
		await matrix.sendEvent(event)
	} catch (err) {
		console.log(err)
	}
}

/**
 * Takes a matrix event of type `org.r4.track` and returns a R4Track object.
 * @param {MatrixTrackEvent} matrixEvent
 * @returns {Track}
 */
function serializeMatrixTrack(matrixEvent) {
	return {
		created_at: new Date(matrixEvent.origin_server_ts).toISOString(),
		id: matrixEvent.event_id,
		slug: matrixEvent.room_id,
		url: matrixEvent.content.url,
		title: matrixEvent.content.title,
		description: matrixEvent.content.description || `Added by ${matrixEvent.sender}`,
	}
}

/**
 * @typedef {object} MatrixTrackEvent
 * @property {string} event_id
 * @property {string} room_id
 * @property {string} sender
 * @property {string} origin_server_ts
 * @property {object} content
 * @property {string} content.url
 * @property {string} content.title
 * @property {string} [content.description]
 */


// Mock local storage required in @sctlib/mwc
if (!globalThis.localStorage) {
	// @ts-ignore
	globalThis.localStorage = {
		getItem(key) {
			return this.storage[key]
		},
		setItem(key, val) {
			this.storage = {...this.storage, [key]: val}
		},
		removeItem(key) {
			let storage = {...this.storage}
			delete storage[key]
			this.storage = storage
		},
		storage: {},
	}
}
