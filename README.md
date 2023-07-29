Experimenting with sqlite in a browser via wasm and web workers.

Vulcan is one way to load sqlite in browser. It also adds persistence, reactivity and merging of two (or more) databases.

- https://observablehq.com/@tantaman/cr-sqlite-basic-setup
- https://vlcn.io/docs/js/persistence
- https://vlcn.io/docs/js/reactivity

If you don't care about reactivity or merging, you can also use this directly:

- https://sqlite.org/wasm/doc/trunk/index.md

To render components I'm using web components via Atomico, just to try something new

- https://atomico.gitbook.io/doc/

To render a table without much work we can use this

- https://fiduswriter.github.io/simple-datatables/documentation/

@todo how we we export/import the sqlite db?

- https://github.com/vlcn-io/cr-sqlite/discussions/266

Other interesting projects using databases in browser

- https://github.com/nalgeon/sqlime