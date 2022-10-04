import { detectCommand } from "./detectCommand.js";
import { splitString } from "./splitString.js";

export interface Command {
    command?: string;
    args: string[];
    raw: string;
    prefix: string;
    separator: string;
}

/**
 * 
 * Returns the command and arguments from a string
 */
export function getCommand (string: string, prefix: string, separator: string = ' '): Command {
    const command: Command = {
        command: undefined,
        args: [],
        raw: string,
        prefix: prefix,
        separator: separator,
    };

    if (!detectCommand(string, prefix)) return command;

    command.command = string.slice(prefix.length).trim().split(/\s+/)[0];

    const args = string.slice(prefix.length).trim().split(/\s+/).splice(1).join(' ') || '';
    command.args = args ? splitString(args, true, separator) : [];

    return command;
}