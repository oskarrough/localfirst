import atomico from '@atomico/vite'
import {comlink} from 'vite-plugin-comlink'

/** @type {import('vite').UserConfig} */
export default {
	plugins: [comlink(), atomico()],
	appType: 'mpa',
	server: {
		headers: {
			'Cross-Origin-Opener-Policy': 'same-origin',
			'Cross-Origin-Embedder-Policy': 'require-corp',
		},
	},
	optimizeDeps: {
		exclude: ['@sqlite.org/sqlite-wasm'],
	},

	build: {
		target: 'esnext',
	},
	worker: {
		plugins: [comlink()],
		format: 'es',
		rollupOptions: {
			output: {
				format: 'es',
			},
		},
	},
}
