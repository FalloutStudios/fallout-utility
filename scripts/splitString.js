const escapeRegExp = require('./escapeRegExp');
const replaceAll = require('./replaceAll');

module.exports = (text = '', removeQuotations = false) => {
    let regex = new RegExp("(?<=^[^\"]*(?:\"[^\"]*\"[^\"]*)*) (?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
    text = text.toString().trim();
    text = escapeRegExp(text);
    text = text.split(regex);
 
    let newText = [];
    for (let value of text) {
        value = replaceAll(value, "\\", '');
        if(removeQuotations) { value = replaceAll(value, '"', ''); }

        newText.push(value);
    }
    text = newText;

    return text;
}

// Split words into object without affecting quoted strings