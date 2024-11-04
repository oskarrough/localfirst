import * as Comlink from 'comlink'

console.log('worker', Date.now())

const obj = {
	counter: 0,
	inc() {
		this.counter++
	},
}

Comlink.expose(obj)
