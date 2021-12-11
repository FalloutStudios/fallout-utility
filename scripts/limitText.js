module.exports = (text = null, length = 0, endsWith = '...') => text != null && text.length >= length ? text.slice(0,length) + endsWith : text;

// Limit the length of a string