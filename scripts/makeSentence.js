module.exports = (object = [], skip = 0) => {
    process.emitWarning(`makeSentence() is deprecated. use <Array>.join(' ') instead.`, 'DeprecationWarning');
    if(typeof object === 'object' && Object.keys(object).length > 0) {
        let outputText = '';
        for (let i = 0; i < Object.keys(object).length; i++) {
            if(i < skip) { continue; }

            outputText += ' ' + object[Object.keys(object)[i]];
        }
        return outputText.trim();
    }
    return '';
}

// Make sentence from an object