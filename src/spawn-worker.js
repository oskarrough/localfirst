import Worker from './worker.js?worker'

const worker = new Worker()

worker.onmessage = function (event) {
	console.log('worker says:', event.data)
	if (event.data.includes('sync done')) {
		worker.postMessage('thanks worker!')
		// @todo update ui or post notification
	}
}
worker.onerror = function (event) {
	console.log('error', event)
}

worker.postMessage(`hey worker, let's get syncing`)

