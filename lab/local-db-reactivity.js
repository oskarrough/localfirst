 import tblrx from '@vlcn.io/rx-tbl'

const rx = tblrx(db)

const disposable = rx.onRange(['channels'], (updateTypes) => {
  console.log('channels changed', updateTypes)
})

const disposable2 = rx.onRange(['tracks'], (updateTypes) => {
  console.log('tracks changed', updateTypes)
})

disposable() // unsubscribe the `onRange` listener
disposable2() // why?

rx.onAny(() => {
  console.log('db had some change')
})

// rx.onPoint('channels', 'xyz', (updateTypes) => {
//   console.log('channel with id xyz changed', updateTypes)
// })

rx.dispose() // uninstall the rx layer

