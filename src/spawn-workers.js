import * as Comlink from 'comlink'

export function makeWorker(file) {
  const worker = new Worker(new URL(file, import.meta.url), {type: 'module'})
  return Comlink.wrap(worker)
}

