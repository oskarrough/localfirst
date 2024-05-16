Experimenting with sqlite in a browser via wasm and web workers.

## SQLite is in the browser

Vulcan is one way to load sqlite in browser. It also adds persistence, reactivity and the option to merge multiple sqlite databases.

- https://vlcn.io/docs/js/wasm
- https://vlcn.io/docs/js/persistence
- https://vlcn.io/docs/js/reactivity
- https://observablehq.com/@tantaman/cr-sqlite-basic-setup
- https://github.com/rhashimoto/wa-sqlite

If you don't care about reactivity or merging, you can also use the WASM package from SQLite directly. This is what we do at the moment.

- https://sqlite.org/wasm/doc/trunk/index.md
- https://github.com/sqlite/sqlite-wasm
- https://sqlite.org/wasm/file/demo-123.js?txt

The database is defined in a web worker, so it doesn't block the main thread.

- https://github.com/sqlite/sqlite-wasm?tab=readme-ov-file#usage-with-vite
- https://vitejs.dev/guide/features.html#web-workers

The worker is exposed to the main thread via `Comcast` dependency. The worker is how you interact with the database. For debugging, use `window.localfirstworker` to test.

## Naive sync engine

You write all data locally using the worker.

And then on top, the user can enable predefined remotes to sync data to. For now, only _pulling_ is implemented. You can't yet _push_ to remotes.

See `./src/remotes/remote.js` for how to create a remote.

Currently we support two remotes:

- A Matrix room
- Radio4000

## UI and components

Not really relevant to this project, but still. To render components I'm using web components via Atomico, just to try something new

- https://atomico.gitbook.io/doc/

To render a table without much work we can use this

- https://fiduswriter.github.io/simple-datatables/documentation/

@todo how we we export/import the sqlite db?

- https://github.com/vlcn-io/cr-sqlite/discussions/266

Other interesting projects using databases in browser

- https://github.com/nalgeon/sqlime
