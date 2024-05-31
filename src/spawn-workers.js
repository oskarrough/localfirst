import * as Comlink from 'comlink'

export let worker

function setup() {
	worker = MagicWorker('worker.js')
}
setup()

function MagicWorker(file) {
	console.log('RANRAN')
	const worker = new Worker(new URL(file, import.meta.url), {type: 'module'})
	return Comlink.wrap(worker)
}

// export var worker = new MagicWorker('worker.js')
// export var worker = MagicWorker('worker.js')

if (typeof window !== 'undefined') {
	console.log('DEBUG TIP: Access the worker on window.localfirstworker')
	window.localfirstworker = worker
}
