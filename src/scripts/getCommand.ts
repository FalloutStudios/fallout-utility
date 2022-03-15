import { detectCommand } from "./detectCommand";
import { splitString } from "./splitString";

interface Command {
    command?: string;
    args?: string[];
    raw?: string;
    prefix?: string;
    separator?: string;
}

export function getCommand (string: string, prefix: string, separator: string = ' '): Command {
    const command: Command = {
        command: undefined,
        args: [],
        raw: string,
        prefix: prefix,
        separator: separator,
    };

    if (!detectCommand(string, prefix)) return command;

    command.args = splitString(string.slice(prefix.length).toString().trim(), true, separator);
    command.command = command.args.shift()?.toLowerCase().trim();

    return command;
}