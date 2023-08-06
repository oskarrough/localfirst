import * as Comlink from 'comlink'
import {recordVisit} from './components/visit-counter.js'
import './ui.js'

export default function MagicWorker(file) {
  return Comlink.wrap(new Worker(new URL(file, import.meta.url), {type: 'module'}))
}

export const worker = new MagicWorker('worker.js')
// export const worker2 = new MagicWorker('worker2.js')

// Increment the visit counter by 1
recordVisit()
