import Remote from './remote.js'
import {createTrack, readTracks} from '../utils/r4-matrix-sdk.js'

/**
 * Usage: new MatrixRemote(db, {roomId: '123'})
 */
export default class MatrixRemote extends Remote {
	async pull() {
		const roomId = this.props?.roomId
		const tracks = await readTracks(roomId)
		console.log('remote: pulling from matrix room', roomId, tracks)
		return this.insertTracks(tracks)
	}
	async push() {
		console.log('remote: pushing to matrix room', this.props?.roomId)
		const roomId = this.props?.roomId
		const track = {
			slug: roomId,
			url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
			title: 'hey',
			description: '',
		}
		const res = await createTrack(roomId, track)
		console.log('here', res)
	}
}
