import atomico from '@atomico/vite'

/** @type {import('vite').UserConfig} */
export default {
	plugins: [
    atomico()
  ],
	appType: 'mpa',
	server: {
		headers: {
			// Needed for @sqlite.org/sqlite-wasm dependency.
			'Cross-Origin-Opener-Policy': 'same-origin',
			'Cross-Origin-Embedder-Policy': 'require-corp',
		},
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
