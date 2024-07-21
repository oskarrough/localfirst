import {Database} from 'bun:sqlite'
import type {Track, SQLTrack} from './schema'
import {TrackTableSQLSchema, SQLTrackSchema} from './schema'
import {localTrackToTrack, trackToLocalTrack} from './utils'

/** Set up (or reuse) a local sqlite database */
export async function setupDatabase(filename: string) {
	const db = new Database(filename, {
		strict: true,
	})
	db.exec('PRAGMA journal_mode = WAL;')
	db.run(TrackTableSQLSchema)
	return db
}

export function getTracks(db: Database): Track[] {
	const query = db.query(`select * from tracks`)
	const localTracks = query.all() as SQLTrack[]
	const tracks = localTracks.map(localTrackToTrack).filter((x) => x !== null)
	return tracks
}

const upsertTrackQuery = (db: Database) =>
	db.query(
		`INSERT OR REPLACE INTO tracks (id, slug, createdAt, updatedAt, title, url, discogsUrl, description, tags, mentions, provider, providerId, files, lastError) VALUES ($id, $slug, $createdAt, $updatedAt, $title, $url, $discogsUrl, $description, $tags, $mentions, $provider, $providerId, $files, $lastError);`,
	)

/** Throws if it cant upsert */
export async function upsertTrack(db: Database, t: Track) {
	// Validate the track
	const trackToInsert = trackToLocalTrack(t)
	const track = SQLTrackSchema.parse(trackToInsert)

	// existing fields would be overwritten, so we keep them here.
	const existing = db.query(`SELECT * FROM tracks WHERE id = $id;`).get({id: track.id}) as SQLTrack
	if (existing) {
		track.files = t.files || existing.files
		track.lastError = t.lastError || existing.lastError
	} else {
		track.files = t.files || null
		track.lastError = t.lastError || null
	}

	upsertTrackQuery(db).run(track)
	console.log('Upserted track', track.title)
}
