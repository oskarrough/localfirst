// Init the local-first sqlite database and remote sync
import './spawn-worker.js'

// Increment the visit counter by 1
import { recordVisit } from './components/visit-counter.js'
recordVisit()

// And finally register the custom elements
import './ui.js'
