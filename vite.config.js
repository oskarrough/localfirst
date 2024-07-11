import atomico from '@atomico/vite'

// Needed for OPFS @sqlite.org/sqlite-wasm to work.
const sqliteheaders = {
	'Cross-Origin-Opener-Policy': 'same-origin',
	'Cross-Origin-Embedder-Policy': 'require-corp',
}

/** @type {import('vite').UserConfig} */
export default {
	plugins: [
		atomico()
	],
	appType: 'mpa',
	server: {
		headers: sqliteheaders
	},
	preview: {
		headers: sqliteheaders
	},
	optimizeDeps: {
		// Needed for @sqlite.org/sqlite-wasm dependency.
		exclude: ['@sqlite.org/sqlite-wasm'],
	},
	build: {
		target: 'esnext',
	},
	worker: {
		format: 'es',
		rollupOptions: {
			output: {
				format: 'es',
			},
		},
	},
}
