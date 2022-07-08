import * as fs from 'fs';
import chalk from 'chalk';
import * as path from 'path';
import inspector from 'inspector';
import { replaceAll } from './replaceAll';
import { trimChars } from './trimChar';
import { isNumber } from './isNumber';
import { Console } from 'console';
import stripAnsi from 'strip-ansi';

export interface LoggerOptions {
    prefixes?: {
        [level: number]: (loggerName?: string) => string;
    },
    colorMessages?: {
        [level: number]: (message: string) => string;
    },
    stringifyJSON?: boolean;
    addPrefixToAllNewLines?: boolean;
    writeStream?: fs.WriteStream;
    enableDebugMode?: boolean;
}

export enum LogLevels {
    INFO,
    WARN, 
    ERROR,
    DEBUG
}

export class Logger {
    public options: LoggerOptions = {
        enableDebugMode: Logger.isDebugging(),
        addPrefixToAllNewLines: true,
        prefixes: {
            [LogLevels.INFO]: (loggerName) => chalk.bold(loggerName ? `${chalk.dim(loggerName)}${chalk.gray('/')}${'INFO'}` : 'INFO') + ' ',
            [LogLevels.WARN]: (loggerName) => chalk.bold(loggerName ? `${chalk.yellow.dim(loggerName)}${chalk.gray('/')}${chalk.yellow('WARN')}` : 'WARN') + ' ',
            [LogLevels.ERROR]: (loggerName) => chalk.bold(loggerName ? `${chalk.red.dim(loggerName)}${chalk.gray('/')}${chalk.red('ERROR')}` : 'ERROR') + ' ',
            [LogLevels.DEBUG]: (loggerName) => chalk.bold(loggerName ? `${chalk.magenta.dim(loggerName)}${chalk.gray('/')}${chalk.magenta('DEBUG')}` : 'DEBUG' + ' ')
        },
        colorMessages: {
            [LogLevels.INFO]: (message: string) => message,
            [LogLevels.WARN]: (message: string) => message,
            [LogLevels.ERROR]: (message: string) => message,
            [LogLevels.DEBUG]: (message: string) => message
        },
        stringifyJSON: true,
    };
    public loggerName?: string;
    protected temporaryPrefix?: string;
    public writeStream?: fs.WriteStream;
    public enableDebugMode: boolean = false;

    constructor(options?: LoggerOptions & { loggerName?: string }) {
        this.options = options ? {...this.options, ...options} : this.options;
        this.loggerName = options?.loggerName ?? undefined;
        this.writeStream = options?.writeStream ?? undefined;
        this.enableDebugMode = options?.enableDebugMode ?? false;
    }

    // Aliases
    public info(...message: string[]): void { this.log(...message); }
    public err(...message: string[]): void { this.error(...message); }
    
    public log(...message: any[]): void { this.parseLogMessage(message, LogLevels.INFO); }
    public warn(...message: any[]): void { this.parseLogMessage(message, LogLevels.WARN); }
    public error(...message: any[]): void { this.parseLogMessage(message, LogLevels.ERROR); }
    public debug(...message: any[]): void { if (this.enableDebugMode) this.parseLogMessage(message, LogLevels.DEBUG); }

    public cloneLogger(options?: LoggerOptions & { loggerName?: string }): Logger {
        const logger = new Logger({ ...this.options, loggerName: this.loggerName, ...(options ?? {}) });

        logger.writeStream = options?.writeStream || this.writeStream;
        logger.enableDebugMode = options?.enableDebugMode || this.enableDebugMode;

        return logger;
    }

    public logFile(fileName: string, overwriteOldFile: boolean = false): Logger {
        if(!fileName) throw new TypeError("Log file path is not defined");

        const dir = path.dirname(fileName);
        const file = path.basename(fileName);

        let writeHeader = false;
        fs.mkdirSync(dir, { recursive: true });

        if(fs.existsSync(fileName) && !overwriteOldFile) {
            const header = this.parseLogHeader(fileName);
            if (header) {
                const date = `${header.date.toDateString()} - ${header.date.getHours()}-${header.date.getMinutes()}-${header.date.getSeconds()}-${header.date.getMilliseconds()}`;
                fs.renameSync(fileName, path.join(dir, `${date}${path.extname(file) ?? '.log'}`));
            } else {
                fs.rmSync(fileName, { recursive: true, force: true });
            }

            writeHeader = true;
        }

        this.writeStream = fs.createWriteStream(fileName);
        if (writeHeader) this.writeStream.write(this.createLogHeader(file));

        return this;
    }

    public setWriteStream(writeStream: fs.WriteStream): void {
        this.writeStream = writeStream;
    }

    public stopLogWriteStream(): void {
        if(!this.writeStream || this.writeStream.destroyed) return;
        
        this.writeStream.end();
        this.writeStream = undefined;
    }

    public setEnableDebugMode(enable: boolean): void {
        this.enableDebugMode = !!enable;
    }

    private parseLogHeader(file: string): { date: Date, file: string }|undefined {
        if (!file) throw new TypeError('file is not defined');
        if (!fs.existsSync(file)) throw new TypeError('file does not exists');

        let log: string|string[] = fs.readFileSync(file, 'utf-8');
            log = log.split(`=`.repeat(20))[0] ?? '';

        if (!log) return undefined;

        log = log.split('\n');
        
        const time = (log[0].startsWith(`Time: `) ? trimChars(log[0], `Time: `) : null);
        const originalFile = (log[0].startsWith(`File: `) ? trimChars(log[0], `File: `) : null) ?? file;

        return {
            date: new Date(isNumber(Number(time)) ? Number(time) : Date.now() - 1),
            file: originalFile
        }
    }

    private createLogHeader(file: string): string {
        if (!file) throw new TypeError('file is not defined');

        return  `Time: ${new Date().getTime()}\n` +
                `File: ${file}\n` +
                `=`.repeat(20) +
                `\n`
    }

    private parseLogMessage(messages: any[], level: LogLevels): void {
        for (const message of messages) {
            if (typeof message == 'string') {
                for (const line of message.split('\n')) {
                    this.writeLog(line, level);
                }

                continue;
            }

            this.writeLog(message, level);
        }
    }

    private writeLog(message: any, level: LogLevels): void {
        
        if (['boolean', 'string', 'number', 'undefined'].includes(typeof message)) {
            return this.print(`${String(message)}`, level);
        } else if (message instanceof Error) {
            if (!message.stack) return this.print(`${message.name}: ${message.message}`, level);
            if (!this.options.addPrefixToAllNewLines) return this.print(`${message.stack}`, level);

            return this.parseLogMessage(message.stack.split('\n'), level);
        } else if (typeof message === 'object' && this.options.stringifyJSON) {
            return this.parseLogMessage(JSON.stringify(message, null, 2).split('\n'), level);
        } else if (typeof message === 'object') {
            this.print(message, level, false, true);
            this.print(`${JSON.stringify(message, null, 2)}`, level, true, false);
        } else if (typeof message === 'function') {
            this.print(`${message.toString()}`, level);
        } else {
            this.print(message, level, false);
        }
    }

    private print(message: any, level: LogLevels = LogLevels.INFO, write: boolean = true, consoleLog: boolean = true): void {
        let prefix: string|Function = this.options.prefixes![level];
            prefix = (prefix ? prefix(this.loggerName) : '') as string;
        let noColorPrefix = stripAnsi(prefix);

        if (consoleLog) {
            const colorize = this.options.colorMessages![level];

            switch (level) {
                case LogLevels.INFO:
                    console.log(prefix, colorize(message));
                    break;
                case LogLevels.WARN:
                    console.warn(prefix, colorize(message));
                    break;
                case LogLevels.ERROR:
                    console.error(prefix, colorize(message));
                    break;
                case LogLevels.DEBUG:
                    console.debug(prefix, colorize(message));
                    break;
            }
        }

        if (!this.writeStream || this.writeStream.destroyed || !write) return;
        this.writeStream.write(`${noColorPrefix ? noColorPrefix + ' ' : ''}${message.toString().trimEnd()}\n`, 'utf-8');
    }

    public static isDebugging(): boolean {
        return !!inspector.url() || /--debug|--inspect/g.test(process.execArgv.join(''));
    }
}