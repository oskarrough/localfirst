import Worker from './worker.js?worker'
import Worker2 from './worker2.js?worker'
import { recordVisit } from './components/visit-counter.js'
import './ui.js'

// Set up first worker.
export const worker = new Worker()
worker.onmessage = function (event) {
	console.log('worker says:', event.data)
	if (event.data.includes('sync done')) {
		worker.postMessage('thanks worker! @todo update ui')
	}
}
worker.onerror = function (event) {
	console.log('error', event)
}
// worker.postMessage('hi worker!')
// worker.postMessage('sync') // this initiates the sync

// Setup second worker.
export const worker2 = new Worker2()
worker2.onmessage = function (event) {
	console.log('worker2 says:', event.data)
	// if (event.data.includes('sync done')) {
	// 	worker.postMessage('thanks worker! @todo update ui')
	// }
}
worker2.onerror = function (event) {
	console.log('worker2 error', event)
}

// Increment the visit counter by 1
recordVisit()
