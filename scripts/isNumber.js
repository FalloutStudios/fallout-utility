/**
 * 
 * @param {*} number - The number to be detected.
 * @returns {boolean} - Returns true if the number is a number.
 */
module.exports = (number) => {
    return !isNaN(parseFloat(number)) && isFinite(number);
}   

// Identify if number