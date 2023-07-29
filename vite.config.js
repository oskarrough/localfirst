/** @type {import('vite').UserConfig} */
export default {
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
