import filenamify from 'filenamify'
import mediaUrlParser from 'media-url-parser'
import {ZodError} from 'zod'
import {sdk} from '@radio4000/sdk'
import {SQLTrackSchema, R4TrackSchema, TrackSchema, type SQLTrack, type R4Track, type Track} from './schema'

/** Fetches tracks by channel slug */
export async function fetchRemoteTracks(slug: string, limit = 4000) {
	if (!slug) return {error: Error('Missing channel slug')}
	const {data, error} = await sdk.supabase
		.from('channel_tracks')
		.select(`id, slug, created_at, updated_at, title, url, discogs_url, description, tags, mentions `)
		.eq('slug', slug)
		.order('created_at', {ascending: false})
		.limit(limit)
		.returns<R4Track[]>()
	if (error) return {error: new Error(`Failed to fetch tracks`)}
	return {data}
}

export function remoteTrackToTrack(t: R4Track): Track | null {
	const {provider, id: providerId} = mediaUrlParser(t.url)
	try {
		return TrackSchema.parse({
			id: t.id,
			createdAt: t.created_at,
			updatedAt: t.updated_at,
			slug: t.slug,
			url: t.url,
			title: t.title,
			description: t.description,
			tags: t.tags,
			mentions: t.mentions,
			discogsUrl: t.discogs_url,
			provider,
			providerId,
		})
	} catch (err) {
		nicerZodError(t, err)
		return null
	}
}

export function trackToRemoteTrack(t: Track): R4Track | null {
	try {
		return R4TrackSchema.parse({
			id: t.id,
			created_at: t.createdAt,
			updated_at: t.updatedAt,
			slug: t.slug,
			url: t.url,
			title: t.title,
			description: t.description,
			tags: t.tags,
			mentions: t.mentions,
			discogs_url: t.discogsUrl,
		})
	} catch (err) {
		nicerZodError(t, err)
		return null
	}
}

export function trackToLocalTrack(t: Track): SQLTrack | null {
	try {
		return SQLTrackSchema.parse({
			...t,
			tags: t.tags ? t.tags.join(',') : null,
			mentions: t.mentions ? t.mentions.join(',') : null,
		})
	} catch (err) {
		nicerZodError(t, err)
		return null
	}
}

export function localTrackToTrack(t: SQLTrack): Track | null {
	try {
		return TrackSchema.parse({
			...t,
			tags: t.tags ? t.tags.split(',') : [],
			mentions: t.mentions ? t.mentions.split(',') : [],
		})
	} catch (err) {
		nicerZodError(t, err)
		return null
	}
}

/** Fetches the channel and tracks and handles errors */
export async function createBackup(slug: string, limit?: number) {
	const promises = [sdk.channels.readChannel(slug), fetchRemoteTracks(slug, limit)]
	try {
		const [radio, tracks] = await Promise.all(promises)
		if (radio.error) throw new Error('Failed to fetch radio. Was it migrated to Radio4000 v2?')
		if (tracks.error) throw new Error(tracks.error.message)
		return {
			data: {
				radio: radio.data,
				tracks: tracks.data as R4Track[],
			},
		}
	} catch (err) {
		return {error: err}
	}
}

export function toFilename(track: SQLTrack | Track, filepath: string) {
	const cleanTitle = filenamify(track.title, {replacement: ' ', maxLength: 255})
	return `${filepath}/${cleanTitle} [${track.providerId}].m4a`
}

function nicerZodError(t: any, err: unknown) {
	if (err instanceof ZodError) {
		const prop = [err.errors[0].path[0]]
		console.log('Failed to parse remote track -> track', {
			trackId: t.id,
			invalidProp: prop[0],
			value: err.errors[0].message,
		})
	}
}
