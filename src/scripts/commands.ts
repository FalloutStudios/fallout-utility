import { startsWith, splitString } from './strings';

export interface CommandData {
    name?: string;
    prefix?: string;
    args: string[];
    raw: string;
    rawArgs: string;
    separator: string;
}

/**
 * Returns the command and arguments from a string
 * @param string Parse message command from this string
 * @param prefix Check this command's prefix
 * @param separator Set arg separator
 */
export function getCommand(string: string, prefix?: string, separator: string = ' '): CommandData {
    const commandData: CommandData = {
        name: undefined,
        prefix,
        args: [],
        raw: string,
        rawArgs: '',
        separator,
    };

    if (prefix && !startsWith(string, prefix)) return commandData;

    commandData.name = (prefix ? string.slice(prefix.length) : string).trim().split(/\s+/)[0];

    commandData.rawArgs = (prefix ? string.slice(prefix.length) : string).slice(commandData.name.length).trim() || '';
    commandData.args = commandData.rawArgs ? splitString(commandData.rawArgs, true, separator) : [];

    return commandData;
}