import {c, html, useState} from 'atomico'

// Wrapper around <button> that allows for "easy" async status in the UI
// For instance, <async-button label="Sync" labeling="Syncing..." action=${somethingSlowAndAsync} />
function component({label, labeling, action}) {
  const [loading, setLoading] = useState(false)
  const doAction = async () => {
    setLoading(true)
    await action()
    setLoading(false)
  }
  return html`<host>
    <button disabled=${loading} onclick=${doAction}>${!loading ? label : labeling}</button>
   </host>`
}

component.props = {
  label: String,
  labeling: String,
  action: Function
}

customElements.define('async-button', c(component))

