import {DB} from '@vlcn.io/crsqlite-wasm'
import {insertChannels, insertTracks} from '../local-db.js'

/**
 * Extend this class to create a new remote.
 The `Remote` class gives you three things:
 - a `db` property, which is a reference to the local database
 - a `props` property, which is an object of props passed to the remote
 - a `insertTracks` method, which inserts tracks into the local database
 - a `insertChannels` method, which inserts channels into the local database
 wait that's four things.
 */
export default class Remote {
	/**
	 * @param {DB} db
	 * @param {object} [props]
	 */
	constructor(db, props) {
		// Use these three to insert data into the local db.
		this.db = db
		this.props = props
		this.insertChannels = insertChannels
		this.insertTracks = insertTracks
	}
	
	/** @returns {Promise<any>} */
	pull() {
		// all remotes must overwrite this method
		return Promise.reject('pull() not implemented')
	}
}
