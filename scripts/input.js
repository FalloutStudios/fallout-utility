/**
 * 
 * @param {Object[]} prompt - The prompt options
 * @param {string} prompt.text - The title of the prompt
 * @param {[string|null]} [prompt.echo=null] - The character to hide the input with
 * @param {boolean} [prompt.repeat=true] - Whether to repeat the prompt if the user doesn't enter anything
 * @param {boolean} [prompt.sigint=true] - Whether to exit the prompt on SIGINT
 * @param {boolean} [prompt.eot=false] - Whether to exit the prompt on EOT
 * @param {string[]} [prompt.exitStrings=[]] - The strings to exit the prompt with
 * @returns The user input
 */
 module.exports = (prompt = { text: '', echo: null, repeat: true, sigint: true, eot: false, exitStrings: ['stop', 'exit'] }) => {
    if(typeof prompt === 'string') {
        prompt = { text: prompt, echo: null, repeat: true, exitStrings: ['stop', 'exit'] };
        process.emitWarning('Passing string to ask() is deprecated. Please pass an object instead.');
    }

    const Prompt = require('prompt-sync')({
        sigint: (prompt?.sigint ? prompt.sigint : true),
        eot: (prompt?.eot ? prompt.eot : true)
    });

    const text = prompt?.text;
    const echo = prompt?.echo;
    const repeat = prompt?.repeat;
    const exitStrings = prompt?.exitStrings;

    if (typeof text !== 'string') throw new Error('text must be a string');
    if (typeof repeat !== 'boolean') throw new Error('repeat must be a boolean');
    if (exitStrings && !Array.isArray(exitStrings)) throw new Error('exitStrings must be an array');

    let response = undefined;
    while (true) {
        if(response || !repeat || (exitStrings && exitStrings.includes(response))) break;

        response = Prompt(text, (echo === null ? null : { echo: echo }));
    }

    return response;
}

// Get user input with or without loop