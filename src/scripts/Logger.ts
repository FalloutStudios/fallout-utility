import { inspect } from 'util';
import { isNumber } from './isNumber.js';
import { trimChars } from './trimChar.js';

import chalk from 'chalk';
import fs from 'fs';
import inspector from 'inspector';
import path from 'path';
import stripAnsi from 'strip-ansi';

export interface LoggerOptions {
    prefixes?: {
        [level: number]: (loggerName?: string) => string;
    },
    /**
     * @deprecated Use {@link LoggerOptions.formatMessages} instead
     */
    colorMessages?: {
        [level: number]: (message: string) => string;
    },
    formatMessages?: {
        [level: number]: (message: string) => string;
    }
    ObjectInspectDepth?: number|null;
    ObjectInspectColorized?: boolean;
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
            [LogLevels.INFO]: (loggerName) => chalk.bgWhite.black(' INFO  ')               +  chalk.bgGray.black(loggerName ? ` ${loggerName} ` : ''),
            [LogLevels.WARN]: (loggerName) => chalk.bgYellowBright.black( ' WARN  ') +  chalk.bgGray.black(loggerName ? ` ${loggerName} ` : ''),
            [LogLevels.ERROR]: (loggerName) => chalk.bgRedBright.black(' ERROR ')   +  chalk.bgGray.black(loggerName ? ` ${loggerName} ` : ''),
            [LogLevels.DEBUG]: (loggerName) => chalk.bgMagentaBright.black(' DEBUG ')     +  chalk.bgGray.black(loggerName ? ` ${loggerName} ` : '')
        },
        formatMessages: {
            [LogLevels.INFO]: (message: string) => message,
            [LogLevels.WARN]: (message: string) => chalk.yellow(message),
            [LogLevels.ERROR]: (message: string) => chalk.red(message),
            [LogLevels.DEBUG]: (message: string) => chalk.magenta(message)
        },
        ObjectInspectColorized: true,
        ObjectInspectDepth: 2,
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

        this.info = this.info.bind(this);
        this.warn = this.warn.bind(this);
        this.err = this.err.bind(this);
        this.log = this.log.bind(this);
        this.warning = this.warning.bind(this);
        this.error = this.error.bind(this);
        this.cloneLogger = this.cloneLogger.bind(this);
        this.logFile = this.logFile.bind(this);
    }

    // Aliases
    public info(...message: any[]): void { this.log(...message); }
    public warn(...message: any[]): void { this.warning(...message); }
    public err(...message: any[]): void { this.error(...message); }

    public log(...message: any[]): void { this.parseLogMessage(message, LogLevels.INFO); }
    public warning(...message: any[]): void { this.parseLogMessage(message, LogLevels.WARN); }
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

        this.setWriteStream(fs.createWriteStream(fileName));
        if (writeHeader) this.writeStream!.write(this.createLogHeader(file));

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
        if (!messages.length) this.writeLog('', level);

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

        if (typeof message === 'string') {
            return this.print(`${String(message)}`, level);
        } else {
            message = inspect(message, false, this.options.ObjectInspectDepth, this.options.ObjectInspectColorized);
            if (!this.options.addPrefixToAllNewLines) return this.print(message, level, true, true);

            return this.parseLogMessage(message.split('\n'), level);
        }
    }

    private print(message: any, level: LogLevels = LogLevels.INFO, write: boolean = true, consoleLog: boolean = true): void {
        let prefix: string|((name?: string) => string) = (this.options.prefixes ?? {})[level] || '';
            prefix = typeof prefix === 'function' ? prefix(this.loggerName) : prefix;
        let noColorPrefix = stripAnsi(prefix);

        if (consoleLog) {
            const colorize = (this.options.formatMessages ?? {})[level] ?? (this.options.colorMessages ?? {})[level];
            switch (level) {
                case LogLevels.INFO:
                    console.log(prefix, colorize ? colorize(message) : message);
                    break;
                case LogLevels.WARN:
                    console.warn(prefix, colorize ? colorize(message) : message);
                    break;
                case LogLevels.ERROR:
                    console.error(prefix, colorize ? colorize(message) : message);
                    break;
                case LogLevels.DEBUG:
                    console.debug(prefix, colorize ? colorize(message) : message);
                    break;
            }
        }

        if (!this.writeStream || this.writeStream.destroyed || !write) return;
        this.writeStream.write(`${noColorPrefix ? noColorPrefix + ' ' : ''}${stripAnsi(message).trimEnd()}\n`, 'utf-8');
    }

    public static isDebugging(): boolean {
        return !!inspector.url() || /--debug|--inspect/g.test(process.execArgv.join(''));
    }
}