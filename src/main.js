// import {recordVisit} from './components/visit-counter.js'
// Increment the visit counter by 1
// recordVisit()
// import './yjs-demo.js'
// import { init } from './spawn-workers.js'

import * as Comlink from 'comlink'

// @todo enable this again
import './ui.js'

console.log('main thread', Date.now())

const worker = new Worker(new URL('worker.js', import.meta.url), {type: 'module'})
const obj = await wrap(worker)

console.log(`Counter: ${await obj.counter}`)
await obj.inc()
console.log(`Counter: ${await obj.counter}`)
await obj.hey()

async function wrap(worker) {
	await new Promise((resolve) => {
		const controller = new AbortController()
		worker.addEventListener(
			'message',
			(msg) => {
				if (msg?.data?.ready) {
					controller.abort()
					resolve()
				}
			},
			{signal: controller.signal}
		)
	})
	return Comlink.wrap(worker)
}
