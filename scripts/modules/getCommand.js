const splitString = require('./splitString');
const detectCommand = require('./detectCommand');

module.exports = (text = '', prefix = '') => {
    let response = {command: null, args: []};

    if(!detectCommand(text, prefix) && prefix != '') return response;
    if(!prefix) prefix = '';

    let args = splitString(text.slice(prefix.length).toString().trim(), false);
    let command = args.shift().toLowerCase().trim();

    response = {command: command, args: args};

    return response;
}