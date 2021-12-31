/**
 * 
 * @param {string} text - The text to be detected. 
 * @param {string} [prefix='/'] - The prefix to be detected.
 * @returns {boolean} Returns true if the prefix is detected.
 */
module.exports = (text = '', prefix = '/') => {
    if(typeof text !== 'string' || text.trim() === '') { return false; }
    if(typeof prefix !== 'string' || prefix.trim() === '') { return false; }
    if(text.slice(0, prefix.length).trim() !== prefix || text.slice(prefix.length).trim() === '') { return false; }

    return true;
}

// Detect prefixed strings