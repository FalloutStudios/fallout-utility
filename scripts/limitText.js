module.exports = (text = null, length = 0, endsWith = '...') => {
    if(text != null && text.length >= length){
        text = text.substr(0,length) + endsWith;
    }
    return text;
}