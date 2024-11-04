import {expect, test} from 'bun:test'
import {fetchRemoteTracks, localTrackToTrack, remoteTrackToTrack, trackToLocalTrack, trackToRemoteTrack} from './utils'
import {SQLTrackSchema, TrackSchema, R4TrackSchema} from './schema'
import {z} from 'zod'

const listOfStrings = z.array(z.string())
// .catch((ctx) => {
// 	console.log(ctx)
// 	return Math.random()
// })
// .transform((val) => {
// 	// return ['hey2']
// 	return 43
// })

test('2 + 2', () => {
	expect(2 + 2).toBe(4)
})

test.skip('list of strings?', () => {
	// expect(listOfStrings.parse(['hey', 'world'])).not.fail()
	expect(listOfStrings.parse('naaa')).fail()
})

// test('new structure', () => {
// 	expect(Track.parse({ id: 'hey' })
// })

test('tracks are tracks', async () => {
	const list = testTracks
	list.forEach((track) => {
		// tracks
		expect(TrackSchema.parse(track)).not.fail()
		// to remote
		expect(R4TrackSchema.parse(trackToRemoteTrack(track))).not.fail()
		// to local track
		expect(SQLTrackSchema.parse(trackToLocalTrack(track))).not.fail()
		// back to track
		// const trackAgain = localTrackToTrack(localTrack)
		// expect(TrackSchema.parse(trackAgain)).not.fail()
	})
})

// test('remote tracks are remote', async () => {
// 	const {data, error} = await fetchRemoteTracks('samro', 2)
// 	if (!data || error) throw error
// 	data.forEach((remotetrack) => {
// 		expect(RemoteTrackSchema.parse(remotetrack)).not.fail()
// 		// const track = remoteTrackToTrack(remotetrack)
// 		// const localTrack = trackToLocalTrack(track)
// 		// expect(TrackSchema.parse(track)).not.fail()
// 		// expect(LocalTrackSchema.parse(localTrack)).not.fail()
// 	})
// })

const testTracks = [
	{
		id: 'ccf2806d-74e4-4055-afde-91fffcc9c44a',
		createdAt: '2024-05-29T04:09:42.559659+00:00',
		updatedAt: '2024-05-29T04:09:42.559659+00:00',
		slug: 'ko002',
		url: 'https://www.youtube.com/watch?v=XeJODyxPGso',
		title: 'Chet Baker & Paul Desmond - Concierto de Aranjuez',
		description: 'thanks @oskar #jazz #1992',
		files: 'downloads/samro/tracks/Notte della Taranta 2020 - PIZZICA [QpVCzLQ56yM].m4a',
		lastError: null,
		discogsUrl:
			'https://www.discogs.com/master/1843910-Chet-Baker-Paul-Desmond-Together-The-Complete-Studio-Recordings',
		provider: 'youtube',
		providerId: 'XeJODyxPGso',
		tags: ['1992', 'jazz'],
		mentions: ['oskar'],
	},
	{
		id: '111b05d6-9d7b-4a4f-9e6c-3502cb952495',
		createdAt: '2024-05-28T12:33:43.085778+00:00',
		updatedAt: '2024-05-28T12:34:00.444255+00:00',
		slug: 'ko002',
		url: 'https://www.youtube.com/watch?v=F0AKD8E9xwg',
		title: '',
		description: '#am #pm #electronic #funk #breaks #soul',
		discogsUrl: null,
		provider: 'youtube',
		providerId: 'F0AKD8E9xwg',
		tags: [],
		mentions: [],
		files: null,
		lastError:
			'Error downloading track: ERROR: [youtube] s8sNnNRhQ2g: Video unavailable. The uploader has not made this video available in your country\n',
	},
]
