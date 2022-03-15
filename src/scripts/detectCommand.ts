export function detectCommand (string: string, commandPrefix: string| string[]) {
    if (!string || !commandPrefix) return false;
    
    commandPrefix = typeof commandPrefix === 'string' ? [commandPrefix] : commandPrefix;
    for (let prefix of commandPrefix) {
        if (string.startsWith(prefix)) return true;
    }

    return false;
}