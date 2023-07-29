const worker = new Worker('./src/worker.js', {type: 'module'})

worker.onmessage = function (event) {
	console.log('worker says:', event.data)
}

worker.onerror = function (event) {
	console.log('error', event)
}

worker.postMessage(`hey worker! let's get syncing`)
