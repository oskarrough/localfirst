// importScripts("https://unpkg.com/comlink@4.4.1/dist/umd/comlink.js");
import * as Comlink from 'comlink'

const obj = {
  counter: 0,
  inc() {
    this.counter++;
  },
}

Comlink.expose(obj)
