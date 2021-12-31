const splitString = require('./splitString');
const detectCommand = require('./detectCommand');

/**
 * 
 * @param {string} text - The text to be detected.
 * @param {strin} prefix - The prefix to be detected. 
 * @returns {Object[]} Returns command information.
 */
module.exports = (text = '', prefix = '') => {
    let response = {command: null, args: []};

    if(!detectCommand(text, prefix) && prefix != '') return response;
    if(!prefix) prefix = '';

    let args = splitString(text.slice(prefix.length).toString().trim(), true);
    let command = args.shift().toLowerCase().trim();

    response = {command: command, args: args};

    return response;
}

// Get command information from string