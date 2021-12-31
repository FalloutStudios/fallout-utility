/**
 * 
 * @param {number} min - The minimum number
 * @param {number} max - The max number
 * @returns {number} Returns a random number between min and max
 */
module.exports = (min = 0, max = 0) => Math.floor(Math.random() * (max - min + 1)) + min

// Random number with min and max values
