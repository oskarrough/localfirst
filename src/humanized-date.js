const time = {
  min: 60000, // milliseconds in a minute
  hour: 3600000, // milliseconds in an hour
  day: 86400000 // milliseconds in a day
}

const dateTimeFormat = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
})

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export default function humanizedDate(timestamp) {
  // Ensuring the timestamp is a valid number
  if (typeof timestamp !== 'number' || isNaN(timestamp)) {
    timestamp  = new Date(timestamp).getTime()
  }

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


window.oskar = {time, dateTimeFormat, rtf, humanizedDate}
