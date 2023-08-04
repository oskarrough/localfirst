import {z} from 'zod'

/** @typedef {z.infer<typeof ChannelSchema>} Channel */
export const ChannelSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional().nullable(),
	slug: z.string(),
	created_at: z.string(),
	updated_at: z.string().optional(),
})

/** @typedef {z.infer<typeof TrackSchema>} Track */
export const TrackSchema = z.object({
	id: z.string(),
	slug: z.string(),
	url: z.string().url(),
	title: z.string(),
	description: z.string().optional().nullable(),
	created_at: z.string(), //.datetime(),
	updated_at: z.string().optional(), //
})
