const worker = new Worker('./src/worker.js', { type: 'module' })

worker.onmessage = function (event) {
	console.log('worker says:', event.data)
	if (event.data.includes('sync done')) {
		worker.postMessage('thanks worker!')
	}
}

worker.onerror = function (event) {
	console.log('error', event)
	// console.error(event.error)
}

worker.postMessage(`hey worker, let's get syncing`)
