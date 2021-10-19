module.exports = (num = 0, str = '') => {
    var returnVal = '';
    for (let i = 0; i < num; i++) {
        returnVal += str;
    }
    return returnVal;
}

// Loop string