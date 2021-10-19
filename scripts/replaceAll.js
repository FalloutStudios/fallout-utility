const escapeRegExp = require('./escapeRegExp');

module.exports = (str, find, replace) => {
    if(str == null) { return; }
    return str.toString().replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

// Replace all matched characters from string