import atomico from '@atomico/vite'

/** @type {import('vite').UserConfig} */
export default {
	plugins: [atomico()],
	server: {
		headers: {
			'Cross-Origin-Opener-Policy': 'same-origin',
			'Cross-Origin-Embedder-Policy': 'require-corp'
		}
	},
	optimizeDeps: {
		exclude: ['@sqlite.org/sqlite-wasm']
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
		}
	},
}
