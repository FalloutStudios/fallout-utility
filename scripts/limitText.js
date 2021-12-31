/**
 * 
 * @param {string} text - The text to be detected.
 * @param {number} length - Max length of the text.
 * @param {string} endsWith - Added to text if it longer than length.
 * @returns {string} - Limit text to length and add endsWith if longer.
 */
module.exports = (text = null, length = 0, endsWith = '...') => text != null && text.length >= length ? text.slice(0,length) + endsWith : text;

// Limit the length of a string