interface PromptOptions {
    text?: string|Buffer|Uint8Array;
    echo?: string;
    repeatIfEmpty?: boolean;
    repeat?: boolean;
    sigint?: boolean;
    eot?: boolean;
    exitStrings?: string[];
}

/**
 * 
 * Prompts the user for input
 */
export function input (prompt: string | PromptOptions = ''): any {
    if (typeof prompt === 'string') {
        prompt = { text: prompt };
    }

    const Prompt = require('prompt-sync')({
        sigint: prompt.sigint || true,
        eof: prompt.eot || true,
    });

    const text = prompt?.text || '';
    const echo = prompt?.echo || '*';
    const repeatIfEmpty = prompt?.repeatIfEmpty || prompt?.repeat || false;
    const exitStrings = prompt?.exitStrings || [];

    let response = undefined;
    while (true) {
        response = Prompt(text, (echo === null ? null : { echo: echo }));
        if(response || !response && !repeatIfEmpty || exitStrings && exitStrings.includes(response)) break;
    }

    return exitStrings.includes(response) ? null : response;
}