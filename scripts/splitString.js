const escapeRegExp = require('./escapeRegExp');
const replaceAll = require('./replaceAll');

/**
 * 
 * @param {string} text - The text to be detected.
 * @param {boolean} [removeQuotations=false] - If true, remove the quotations from the text.
 * @returns {Object[]} - Returns an array of objects.
 */
module.exports = (text = '', removeQuotations = false) => {
    let regex = new RegExp("(?<=^[^\"]*(?:\"[^\"]*\"[^\"]*)*) (?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
    text = text.toString().trim();
    text = escapeRegExp(text);
    text = text.split(regex);
 
    let newText = [];
    for (let value of text) {
        value = replaceAll(value, "\\", '');
        if(removeQuotations) value = replaceAll(value, '"', '');

        newText.push(value);
    }
    text = newText;

    return text;
}

// Split words into object without affecting quoted strings