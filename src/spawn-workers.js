import * as Comlink from 'comlink'

export let worker = MagicWorker('worker.js')

function MagicWorker(file) {
	console.log('Creating magic worker')
	const worker = new Worker(new URL(file, import.meta.url), {type: 'module'})
	return Comlink.wrap(worker)
}

// export var worker = new MagicWorker('worker.js')
// export var worker = MagicWorker('worker.js')

if (typeof window !== 'undefined') {
	window.localfirstworker = worker
	console.log('DEBUG TIP: Access the worker on window.localfirstworker')
}
