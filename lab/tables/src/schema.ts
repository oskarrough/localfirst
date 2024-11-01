export interface Track {
	// from supabase schema
	id?: string
	created_at: string
	updated_at: string
	title: string
	url: string
	description?: string
	tags: string[]
	mentions: string[]

	// custom ones
	provider?: string
	providerId?: string
	slug: string
	lastError?: string
}
