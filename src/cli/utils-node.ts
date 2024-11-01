import {$, ShellError} from 'bun'
import {Database} from 'bun:sqlite'
import type { Track, SQLTrack } from './schema'

/** Downloads the audio from a URL (supported by yt-dlp) */
export async function downloadAudio(url: string, filepath: string, metadataDescription: string) {
	return $`yt-dlp -f 'bestaudio[ext=m4a]' --no-playlist --restrict-filenames --output ${filepath} --parse-metadata "${metadataDescription}:%(meta_comment)s" --embed-metadata --quiet --progress ${url}`
}

/** Downloads the URL of a track to disk, and updates the track in the local database. */
export async function downloadTrack(t: SQLTrack | Track, filename: string, db: Database) {
	try {
		await downloadAudio(t.url, `${filename}`, t.description || '')
		db.query(`UPDATE tracks SET files = $files, lastError = $lastError WHERE id = $id;`).run({
			id: t.id,
			files: `${filename}`,
			lastError: null,
		})
	} catch (err: unknown) {
		// note, the stderr is logged to the console before this..
		const error = err as ShellError
		t.lastError = `Error downloading track: ${error.stderr.toString()}`
		db.query(`UPDATE tracks SET files = $files, lastError = $lastError WHERE id = $id;`).run({
			id: t.id,
			files: null,
			lastError: t.lastError,
		})
	}
}
