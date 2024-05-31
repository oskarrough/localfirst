/**
 * @param {number} startMs
 * @returns {string}
 */
export function secondsSince(startMs) {
	return ((performance.now() - startMs) / 1000).toFixed(3)
}
