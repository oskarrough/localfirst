import Worker from './worker.js?worker'
import { recordVisit } from './components/visit-counter.js'
import './ui.js'

export const worker = new Worker()

worker.onmessage = function (event) {
	console.log('worker says:', event.data, event)
	if (event.data.includes('sync done')) {
		worker.postMessage('thanks worker! @todo update ui')
	}
}
worker.onerror = function (event) {
	console.log('error', event)
}

// Initiate sync
worker.postMessage('sync')

// Increment the visit counter by 1
recordVisit()

