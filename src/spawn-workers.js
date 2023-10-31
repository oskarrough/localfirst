import * as Comlink from 'comlink'

export function MagicWorker(file) {
  const worker = new Worker(new URL(file, import.meta.url), {type: 'module'})
  return Comlink.wrap(worker)
}

// export var worker = new MagicWorker('worker.js')
export var worker = new MagicWorker('worker2.js')
// export const testWorker = new MagicWorker('worker-test.js')

// async function what() {
//   console.log(`testworker ${await testWorker.counter}`)
//   console.log('worker2', (await worker2.query('select name from employees limit 1')))
// }

// what()

