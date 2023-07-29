import { LitElement, css, html } from 'lit'
import { getDb } from './local.js'
import { nanoid } from 'nanoid'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class MyElement extends LitElement {
	static get properties() {
		return {
			/** The number of times the button has been clicked. */
			count: { type: Number },
		}
	}

	constructor() {
		super()
		this.count = 0
		// this.setupDb()
	}

	async setupDb() {
		const db = await getDb()
		this.db = db
		await db.exec('create table if not exists counters(id primary key, count integer, created)')
		this.counterId = nanoid()
		await db.exec('insert into counters (id, count, created) values (?, ?, ?)', [
			this.counterId,
			this.count,
			new Date().getTime(),
		])
		const counter = await db.execO('select * from counters where id = ?', [this.counterId])
		console.log('counter', counter)
	}

	render() {
		return html`
			<slot></slot>
			<div>
				<button @click=${this._onClick} part="button">count is ${this.count}</button>
			</div>
		`
	}

	async _onClick() {
		this.count++
		await this.db.execO('update counters set count = ? where id = ?', [this.count, this.counterId])
		const [counter] = await this.db.execO('select * from counters where id = ?', [this.counterId])
		console.log('update', counter.count)
	}

	static get styles() {
		return css`
			:host {
				max-width: 1280px;
				margin: 0 auto;
				text-align: center;
			}
			::slotted(h1) {
				font-size: 3em;
				line-height: 1.1;
			}
		`
	}
}

window.customElements.define('my-element', MyElement)
