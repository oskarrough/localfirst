import {z} from 'zod'

/**
  These schemas exist for runtime (and type) validations. Unfortunately we have three different tracks.
  Why are they different, you might ask. Good question.

  - SQLite and PostgreSQL aren't compatible, sqlite has no string[] column, for example.
  - Remote schemas are different from local schemas, we want to be able to go from any schema to any schema

  Another reason is that it's good exercise to handle different schemas. I'd also want to sync to Matrix, not just Radio4000 v2.

  SQLTrack = for storing in the local SQLite database
  Track = for use in the app
  R4Track = for fetching from the remote Radio4000 v2 API
  MatrixTrack = for syncing to Matrix
*/

const BaseTrackSchema = z.object({
	id: z.string(),
	createdAt: z.string().datetime({offset: true}),
	updatedAt: z.string().datetime({offset: true}).optional(),
	slug: z.string(),
	url: z.string().url(),
	title: z.string(),
	description: z.string().nullable(),
	discogsUrl: z.string().url().optional().or(z.string().nullable()),
	files: z.string().optional().nullable(),
	lastError: z.string().optional().nullable(),
	provider: z.string().optional().nullable(),
	providerId: z.string().optional().nullable(),
})

export const SQLTrackSchema = BaseTrackSchema.extend({
	tags: z.string().optional(),
	mentions: z.string().optional(),
})
export type SQLTrack = z.infer<typeof SQLTrackSchema>

export const TrackSchema = BaseTrackSchema.extend({
	tags: z.array(z.string()).optional(),
	mentions: z.array(z.string()).optional(),
})
export type Track = z.infer<typeof TrackSchema>

export const R4TrackSchema = z.object({
	...TrackSchema.pick({
		id: true,
		slug: true,
		url: true,
		title: true,
		description: true,
	}).shape,
	// these are named differently
	created_at: z.string().datetime({offset: true}),
	updated_at: z.string().datetime({offset: true}).optional(),
	discogs_url: z.string().url().optional().or(z.string().nullable()),
	// postgresql has a string[] column, sqlite does snot
	tags: z.array(z.string()).optional(),
	mentions: z.array(z.string()).optional(),
})
export type R4Track = z.infer<typeof R4TrackSchema>

export const ChannelSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional().nullable(),
	slug: z.string(),
	url: z.string().url().optional(),
	created_at: z.string(),
	updated_at: z.string().optional(),
})
export type Channel = z.infer<typeof ChannelSchema>

export const testTables = `
	CREATE TABLE IF NOT EXISTS counters(id primary key, count integer);
`

export const settingsTable = `
	CREATE TABLE IF NOT EXISTS settings(id primary key, provider_r4 integer, provider_matrix integer);
	INSERT OR IGNORE INTO settings (id, provider_r4, provider_matrix) values (1, 0, 0);
`

export const channelsTable = `
	CREATE TABLE IF NOT EXISTS channels (
		id TEXT primary key,
		slug unique not null,
		name TEXT not null,
		createdAt TEXT,
		updatedAt TEXT
  );
`

// FOREIGN KEY (slug) REFERENCES channels(slug) ON DELETE CASCADE,
export const tracksTable = `
	CREATE TABLE IF NOT EXISTS tracks (
		id TEXT PRIMARY KEY,
		createdAt TEXT,
		updatedAt TEXT,
		slug TEXT not null,
		url TEXT not null,
		title TEXT,
		description TEXT,
		tags TEXT,
		mentions TEXT,
		discogsUrl TEXT,
		files TEXT,
		lastError TEXT,
		provider TEXT,
		providerId TEXT
	);`
