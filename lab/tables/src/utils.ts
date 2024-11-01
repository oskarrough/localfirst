import {sdk} from '@radio4000/sdk'
import mediaUrlParser from 'media-url-parser'
// import {pipe, map} from 'remeda'
import type {Track} from './schema.ts'
// import type {Database} from '../database.types.ts'
// export let supabase: SupabaseClient<Database>

/** Fetches tracks by channel slug */
export async function fetchTracks(slug: string, limit = 4000) {
	if (!slug) return {error: new Error('Missing channel slug')}
	const {data, error} = await sdk.supabase
		.from('channel_tracks')
		.select(`id, slug, created_at, updated_at, title, url, discogs_url, description, tags, mentions `)
		.eq('slug', slug)
		.order('created_at', {ascending: false})
		.limit(limit)
	if (error) return {error}
	return {
		data: data.map((track) => addProviderInfo(track)),
	}
}

export function addProviderInfo(track: Track) {
	const {provider, id: providerId} = mediaUrlParser(track.url)
	track.provider = provider
	track.providerId = providerId
	return track
}

/** Fetches the channel and tracks and handles errors */
export async function createBackup(slug: string, limit?: number) {
	const promises = [sdk.channels.readChannel(slug), fetchTracks(slug, limit)]
	try {
		const [radio, tracks] = await Promise.all(promises)
		if (radio.error) throw new Error('Failed to fetch radio. Was it migrated to Radio4000 v2?')
		if (tracks.error) throw new Error(tracks.error.message)
		return {
			data: {
				radio: radio.data,
				tracks: tracks.data,
			},
		}
	} catch (err) {
		return {error: err}
	}
}
