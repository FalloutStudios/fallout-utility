/**
 * 
 * @param {string} string - The string to escape
 * @returns {string} The escaped string
 */
module.exports = (string) => {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// Escape regular expression pattern