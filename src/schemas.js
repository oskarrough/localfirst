import {z} from 'zod'

/** The SQLite3 schema */
export const schema = `
create table if not exists employees(id, name, age);
create table if not exists counters(id primary key, count integer);

create table if not exists channels(id primary key, name, slug unique, created_at);
create table if not exists tracks(id primary key, slug not null, url, title, description, created_at, updated_at, foreign key(slug) references channels(slug) on delete cascade);

create table if not exists settings(id primary key, provider_r4 integer, provider_matrix integer);
insert or ignore into settings (id, provider_r4, provider_matrix) values (1, 0, 0);

--select crsql_as_crr('channels');
--select crsql_as_crr('tracks');
`

/** @typedef {z.infer<typeof ChannelSchema>} Channel */
export const ChannelSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional().nullable(),
	slug: z.string(),
	url: z.string().url().optional(),
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
