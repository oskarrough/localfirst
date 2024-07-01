import * as Comlink from 'comlink'

export function MagicWorker(file) {
  const worker = new Worker(new URL(file, import.meta.url), {type: 'module'})
  return Comlink.wrap(worker)
}

// export var worker = new MagicWorker('worker.js')
export var worker = MagicWorker('worker.js')
// export const testWorker = new MagicWorker('worker-test.js')

console.log('DEBUG TIP: Access the worker on window.localfirstworker')
window.localfirstworker = worker
