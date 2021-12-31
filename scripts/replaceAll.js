const escapeRegExp = require('./escapeRegExp');

/**
 * 
 * @param {string} str - Given string
 * @param {string} find - The string to be replaced
 * @param {string} replace - The string to replacement
 * @returns {string} Returns the modified string
 */
module.exports = (str, find, replace) => {
    if(str == null) { return; }
    return str.toString().replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

// Replace all matched characters from string