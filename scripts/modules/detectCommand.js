module.exports = (text = '', prefix = '>') => {
    if(typeof text !== 'string' || text.trim() === '') { return false; }
    if(typeof prefix !== 'string' || prefix.trim() === '') { return false; }
    if(text.substr(0, prefix.length).trim() !== prefix || text.substr(prefix.length).trim() === '') { return false; }

    return true;
}