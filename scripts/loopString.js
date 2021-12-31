/**
 * 
 * @param {number} [num=0] - The number on which how many times to loop given string. 
 * @param {string} str - The str to be looped.
 * @returns {string} Returns the looped string.
 */
module.exports = (num = 0, str = '') => {
    let returnVal = '';
    for (let i = 0; i < num; i++) {
        returnVal += str;
    }
    return returnVal;
}

// Loop string