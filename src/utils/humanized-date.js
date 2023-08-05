// Miliseconds in different time units
const time = {
	min: 60000,
	hour: 3600000,
	day: 86400000,
}

const dateTimeFormat = new Intl.DateTimeFormat('en', {
	day: 'numeric',
	month: 'short',
	year: 'numeric',
})

const rtf = new Intl.RelativeTimeFormat('en', {numeric: 'auto'})

/**
 *
 * @param {number} timestamp
 * @returns {string}
 */
export default function humanizedDate(timestamp) {
	// Ensuring the timestamp is valid
	if (isNaN(timestamp)) {
		timestamp = new Date(timestamp).getTime()
	}
	
	if (!timestamp) return '?'

	const nowMs = Date.now()
	const diffMs = nowMs - timestamp

	if (diffMs < time.hour) {
		return rtf.format(-Math.floor(diffMs / time.min), 'minute')
	} else if (diffMs < time.day) {
		return rtf.format(-Math.floor(diffMs / time.hour), 'hour')
	} else if (diffMs < 30 * time.day) {
		return rtf.format(-Math.floor(diffMs / time.day), 'day')
	} else {
		return dateTimeFormat.format(timestamp)
	}
}
