import { WriteStream, createWriteStream, existsSync, lstatSync, mkdirSync, renameSync } from 'fs';
import { TypedEmitter } from 'tiny-typed-emitter';
import { Awaitable } from '../../types';
import { isDebugging, path } from '../system';
import { InspectOptions, inspect } from 'util';
import stripAnsi from 'strip-ansi';

export enum LoggerLevel {
    INFO = 1,
    WARN, 
    ERROR,
    DEBUG
}

export interface LoggerOptions {
    formatMessageLines?: {
        [level: number]: (message: string, logger: Logger) => string;
    },
    objectInspectOptions?: InspectOptions;
    enableDebugmode?: boolean|null;
    forceEmitLogEvents?: boolean;
    writeStream?: WriteStream;
    name?: string;
}

export interface LoggerEvents {
    log: (message: string) => Awaitable<void>;
    warn: (message: string) => Awaitable<void>;
    err: (message: string) => Awaitable<void>;
    debug: (message: string) => Awaitable<void>;
}

export class Logger extends TypedEmitter<LoggerEvents> {
    public formatMessageLines: Exclude<LoggerOptions['formatMessageLines'], undefined>;
    public objectInspectOptions?: InspectOptions;
    public enableDebugmode: boolean|null;
    public forceEmitLogEvents: boolean;
    public writeStream?: WriteStream;
    public name?: string;

    get isDebugging() {
        return this.enableDebugmode || isDebugging(); 
    }

    constructor(options?: LoggerOptions) {
        super();

        this.formatMessageLines = options?.formatMessageLines ?? {};
        this.objectInspectOptions = options?.objectInspectOptions ?? { colors: true };
        this.enableDebugmode = options?.enableDebugmode ?? null;
        this.forceEmitLogEvents = options?.forceEmitLogEvents ?? false;
        this.writeStream = options?.writeStream;
        this.name = options?.name;

        this.info = this.info.bind(this);
        this.warn = this.warn.bind(this);
        this.err = this.err.bind(this);
        this.log = this.log.bind(this);
        this.warning = this.warning.bind(this);
        this.error = this.error.bind(this);
        this.debug = this.debug.bind(this);
        this.clone = this.clone.bind(this);
    }

    public info(...message: any[]): void { this.log(...message); }
    public warn(...message: any[]): void { this.warning(...message); }
    public err(...message: any[]): void { this.error(...message); }

    public log(...messages: any[]): void {
        const message = this._print(messages, LoggerLevel.INFO).join('\n');

        this._write(message, LoggerLevel.INFO);
        this.emit('log', message);
    }
    public warning(...messages: any[]): void {
        const message = this._print(messages, LoggerLevel.WARN).join('\n');

        this._write(message, LoggerLevel.WARN);
        this.emit('warn', message);
    }
    public error(...messages: any[]): void {
        const message = this._print(messages, LoggerLevel.ERROR).join('\n');

        this._write(message, LoggerLevel.ERROR);
        this.emit('err', message);
    }
    public debug(...messages: any[]): void {
        const message = this._print(messages, LoggerLevel.DEBUG).join('\n');

        if (this.forceEmitLogEvents && !this.isDebugging) this.emit('debug', message);
        if (!this.isDebugging) return;

        this._write(message, LoggerLevel.DEBUG);
        this.emit('debug', message);
    }

    public logFile(filePath: string, overwriteOldFile: boolean = false): this {
        if (this.writeStream) throw new Error('Logger already has an open file write stream.');

        const filePathInfo = path.parse(filePath);

        mkdirSync(filePathInfo.dir, { recursive: true });

        if (existsSync(filePath) && !overwriteOldFile) {
            const fileInfo = lstatSync(filePath);
            const dateFormat = `${fileInfo.birthtime.toDateString()} - ${fileInfo.birthtime.getHours()}-${fileInfo.birthtime.getMinutes()}-${fileInfo.birthtime.getSeconds()}-${fileInfo.birthtime.getMilliseconds()}`;

            renameSync(filePath, path.join(filePathInfo.dir, `${dateFormat}${filePathInfo.ext}`));
        }

        this.setWriteStream(createWriteStream(filePath));

        return this;
    }

    public setDebugMode(enabled: boolean|null): this {
        this.enableDebugmode = enabled;
        return this;
    }

    public setName(name: string): this {
        this.name = name;
        return this;
    }

    public setWriteStream(writeStream: WriteStream): this {
        if (this.writeStream) throw new Error('Logger already has an open file write stream.');

        this.writeStream = writeStream;
        return this;
    }

    public closeWriteStream(): this {
        this.writeStream?.close();
        this.writeStream = undefined;

        return this;
    }

    public clone(options?: LoggerOptions): Logger {
        return new Logger({
            ...this,
            ...options
        });
    }

    protected _print(messages: any[], level: LoggerLevel): string[] {
        const formatter = (this.formatMessageLines[level] ?? (e => e));
        if (!messages.length) this._write(formatter('', this), level);

        const lines = messages.map(msg => typeof msg === 'string' ? msg : inspect(msg, this.objectInspectOptions))
            .join(' ')
            .split('\n')
            .map(msg => formatter(msg, this));

        return lines;
    }

    protected _write(message: string, level: LoggerLevel, logToConsole: boolean = true, logToFile: boolean = true): void {
        if (logToConsole) {
            switch (level) {
                case LoggerLevel.INFO:
                    console.log(message);
                    break;
                case LoggerLevel.WARN:
                    console.warn(message);
                    break;
                case LoggerLevel.ERROR:
                    console.error(message);
                    break;
                case LoggerLevel.DEBUG:
                    console.debug(message);
                    break;
            }
        }

        if (logToFile) {
            const strippedMessage = stripAnsi(message);
            this.writeStream?.write(`${strippedMessage}\n`, 'utf-8');
        }
    }
}