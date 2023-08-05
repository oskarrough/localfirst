import Remote from './remote.js'
import {sdk} from '@radio4000/sdk'

export default class R4Remote extends Remote {
	async pull() {
		console.log('remote: pulling from @radio4000/sdk')
		await this.pullChannels()
		await this.pullTracks()
	}

	async pullChannels() {
		const {data, error} = await sdk.channels.readChannels()
		if (error && !data?.length) return
		return this.insertChannels(data)
	}

	async pullTracks() {
		const db = this.db

		/** @type {Array<import('../types.js').Channel>} */
		const channels = await db.execO('select * from channels')

		// await db.exec('begin transaction')
		await Promise.all(
			channels.map(async ({slug}) => {
				const {data, error} = await sdk.channels.readChannelTracks(slug)
				if (error || !data?.length) return
				const tracks = data?.map((t) => ({...t, slug}))
				return this.insertTracks(tracks)			
			})
		)
		// await db.exec('commit')
	}
}
