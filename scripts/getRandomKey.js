const randomInt = require('./randomInt');

/**
 * 
 * @param {Object[]} object - The object to select random key from.
 * @returns {*} The selected random key.
 */
module.exports = (object = null) => {
    if(!object || object == null) return;
    if(typeof object == 'string' || typeof object == 'number') return object;
    if(typeof object != 'object') return;

    let objectKeys = Object.keys(object);
    let objectMax = objectKeys.length;

    return object[randomInt(0, (objectMax - 1))];
}