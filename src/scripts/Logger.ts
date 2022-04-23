import { default as chalk } from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { replaceAll } from './replaceAll';
import inspector from 'inspector';

export interface OptionsPrefixInsterface {
    /**
     * Prefix to add to the log messages
     */
    enabled: boolean;
    /**
     * First bracket char
     */
    startBracket: string;
    /**
     * End bracket char
     */
    endBracket: string;
    /**
     * Prefix and level strings separator
     */
    separator: string;
    /**
     * Level names
     */
    levels: string[];
}

export interface OptionsInterface {
    /**
     * Log messages prefix options
     */
    prefix?: OptionsPrefixInsterface;
    /**
     * Stringify objects when printing to console
     */
    stringifyJSON?: boolean;
    /**
     * Adds log prefix to JSON new lines (\n) in the log file
     */
    addPrefixToEveryJsonNewLines?: boolean;
    /**
     * Custom write stream
     */
    writeStream?: fs.WriteStream;

    /**
     * Set debug mode
     */
    setDebugging?: boolean;
}

/**
 * Levels
 */
export type LevelNumbers = 0 | 1 | 2 | 3;

export class Logger {

    public options: OptionsInterface = {
        stringifyJSON: false,
        writeStream: undefined,
        setDebugging: undefined,
        prefix: {
            enabled: true,
            startBracket: '[',
            endBracket: ']',
            separator: ' - ',
            levels: ['INFO', 'WARN', 'ERROR', 'DEBUG']
        },
    };
    public defaultPrefix?: string;
    public writeStream: fs.WriteStream | undefined;
    public debugging: boolean = false;

    constructor(defaultPrefix?: string, options?: OptionsInterface) {
        this.options = options || this.options;
        this.defaultPrefix = defaultPrefix;
        this.writeStream = options?.writeStream || undefined;

        this.debugging = options && options?.setDebugging !== undefined ? options?.setDebugging : Logger.isDebugging();
    }

    /**
     * 
     * Log to file
     */
    logFile(logFilePath: string, overwriteOldFile: boolean = false): Logger {
        if(!logFilePath) throw new TypeError("Log file path is not defined");

        const dir = path.dirname(logFilePath);
        const file = path.basename(logFilePath);
        const header = `[LOG HEADER] ${replaceAll(new Date().toJSON(), ':', '-')}\n[LOG] Original file: ${file}\n[LOG] Original path: ${dir}\n`;

        let overwriten = false;
        if(fs.existsSync(logFilePath)) {
            if (!overwriteOldFile) {
                const fileInfo = path.parse(file);
                const headerInfo = this.parseLogHeader(fs.readFileSync(logFilePath, 'utf8')).map(line => line.replace('[LOG HEADER] ', ''));
                fs.renameSync(logFilePath, path.join(dir, `${headerInfo[0] || replaceAll(new Date().toJSON(), ':', '-') + '-1'}${fileInfo.ext}`));
                overwriten = true;
            }
        } else {
            fs.mkdirSync(dir, { recursive: true });
            overwriten = true;
        }

        this.writeStream = fs.createWriteStream(logFilePath);
        if (overwriten) this.writeStream.write(header);
        
        return this;
    }

    /**
     * 
     * Sets the current write stream
     */
    setWriteStream(writeStream: fs.WriteStream): Logger {
        this.writeStream = writeStream;
        return this;
    }

    /**
     * 
     * Creates new logger
     */
    cloneLogger(): Logger {
        const logger = new Logger(this.defaultPrefix, this.options);

        logger.writeStream = this.writeStream;
        logger.debugging = this.debugging;

        return logger;
    }

    setDebugging(debugging: boolean): Logger {
        this.debugging = !!debugging;
        return this;
    }

    /**
     * 
     * Remove write stream
     */
    stopLogWriteStream(): Logger {
        if(!this.writeStream) return this;
        
        this.writeStream.end();
        this.writeStream = undefined;

        return this;
    }

    private parseLogHeader(log: string): string[] {
        return log.split('\n').filter(line => line.startsWith('[LOG HEADER]'));
    }

    /**
     * 
     * Print message to console
     */
    log (args: any, setPrefix: string|undefined = this.defaultPrefix): void { return this.parseLogMessage(args, setPrefix, 0); }
    /**
     * 
     * Print message to console
     */
    info (args: any, setPrefix: string|undefined = this.defaultPrefix): void { return this.parseLogMessage(args, setPrefix, 0); }
    /**
     * 
     * Print warn message to console
     */
    warn (args: any, setPrefix: string|undefined = this.defaultPrefix): void { return this.parseLogMessage(args, setPrefix, 1); }
    /**
     * 
     * Print error message to console
     */
    error (args: any, setPrefix: string|undefined = this.defaultPrefix): void { return this.parseLogMessage(args, setPrefix, 2); }

    /**
     * 
     * Print a debug message to console only if the debug mode is enabled
     */
    debug (args: any, setPrefix: string|undefined = this.defaultPrefix): void { return this.debugging ? this.parseLogMessage(args, setPrefix, 3) : undefined; }

    private parseLogMessage (message: any, setPrefix: string|undefined = this.defaultPrefix, level: LevelNumbers = 0): void {
        if (typeof message === 'string') {
            message = message.split('\n');
            
            for (let value of message) {
                this.writeLog(value, setPrefix, level);
            }
            return;
        }

        this.writeLog(message, setPrefix, level);
    }

    private writeLog (message: any, prefix: string|undefined = this.defaultPrefix, level: LevelNumbers = 0): void {
        const consolePrefix = this.getPrefix(prefix, level);
        const consolePrefixText = this.getPrefix(prefix, level, false);

        if (typeof message === 'string' || typeof message === 'number') {
            console.log(consolePrefix, `${message}`);
            this.writeToStream(`${message}`, consolePrefixText);
        } else if (message instanceof Error) {
            console.log(consolePrefix, message);
            
            const stack = message.stack?.split('\n');
            if (!stack) return;

            if (this.options.addPrefixToEveryJsonNewLines) {
                stack.forEach(line => this.writeToStream(line, consolePrefixText));
            } else {
                this.writeToStream(`\n${stack.join('\n')}`, consolePrefixText);
            }
        } else if (typeof message === 'object' && this.options.stringifyJSON) {
            this.parseLogMessage(JSON.stringify(message, null, 2), prefix, level);
            return;
        } else if (typeof message === 'object') {
            console.log(consolePrefix);
            console.log(message);

            const json = JSON.stringify(message, null, 2);
            if (this.options.addPrefixToEveryJsonNewLines) {
                json.split('\n').forEach(line => this.writeToStream(line, consolePrefixText));
            } else {
                this.writeToStream(`\n${json}`, consolePrefixText);
            }
        } else {
            console.log(consolePrefix);
            console.log(message);

            this.writeToStream(message, consolePrefixText);
        }
    }

    private getPrefix(prefix?: string, level: LevelNumbers = 0, colors: boolean = true): string {
        if (this.options.prefix?.enabled === false) return '';

        const levelPrefix = this.options.prefix?.levels[level] || (['INFO', 'WARN', 'ERROR', 'DEBUG'])[level];

        return `${ this.options.prefix?.startBracket || '[' }${!colors ? levelPrefix : chalk.bold(this.colorize(levelPrefix, level))}`+ (prefix ? `${ this.options.prefix?.separator || ' - ' }${prefix}` : ``) + `${ this.options.prefix?.endBracket || ']' }`;
    }

    private writeToStream(message: string, prefix: string): Logger {
        if (!this.writeStream) return this;
        this.writeStream.write(`${prefix} ${message}`, 'utf-8');
        
        return this;
    }

    private colorize(string: string, level: LevelNumbers): string {
        switch (level) {
            case 0: return string;
            case 1: return chalk.yellow(string);
            case 2: return chalk.red(string);
            case 3: return chalk.blue(string);
        }
    }

    public static isDebugging(): boolean {
        return !!inspector.url() || /--debug|--inspect/g.test(process.execArgv.join(''));
    }
}