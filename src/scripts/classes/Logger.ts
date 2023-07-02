import { Stats, WriteStream, createWriteStream, existsSync, lstatSync, mkdirSync, renameSync } from 'node:fs';
import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import { InspectOptions, deprecate, inspect, stripVTControlCharacters } from 'node:util';
import { TypedEmitter } from './TypedEmitter';
import { Awaitable } from '../../types';
import { isDebugging } from '../system';
import { gzipSync } from 'node:zlib';
import ansiRegex from 'ansi-regex';
import path from 'node:path';

export enum LoggerLevel {
    INFO = 1,
    WARN, 
    ERROR,
    DEBUG
}

export interface LoggerOptions {
    formatMessage?: (message: string, level: LoggerLevel, logger: Logger) => string;
    /**
     * @deprecated Use {@link LoggerOptions.formatMessage} instead
     */
    formatMessageLines?: {
        [level: number]: ((message: string, logger: Logger) => string)|undefined;
    },
    objectInspectOptions?: InspectOptions|null;
    enableDebugmode?: boolean|null;
    forceEmitLogEvents?: boolean|null;
    writeStream?: WriteStream|null;
    name?: string|null;
    parent?: Logger|null;
}

export interface LoggerFileWriteStreamOptions {
    file: string;
    renameOldFile?: boolean;
    handleOldFile?: (file: string) => Awaitable<void>;
}

export interface LoggerEvents {
    log: [message: string];
    warn: [message: string];
    err: [message: string];
    debug: [message: string];
}

export class Logger extends TypedEmitter<LoggerEvents> {
    readonly parent?: Logger;

    public formatMessage?: (message: string, level: LoggerLevel, logger: Logger) => string;
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

        this.formatMessage = options?.formatMessage;
        this.formatMessageLines = options?.formatMessageLines ?? {};
        this.objectInspectOptions = options?.objectInspectOptions ?? { colors: true };
        this.enableDebugmode = options?.enableDebugmode ?? null;
        this.forceEmitLogEvents = options?.forceEmitLogEvents ?? false;
        this.writeStream = options?.writeStream || undefined;
        this.name = options?.name || undefined;
        this.parent = options?.parent || undefined;

        this.info = this.info.bind(this);
        this.warn = this.warn.bind(this);
        this.err = this.err.bind(this);
        this.log = this.log.bind(this);
        this.warning = this.warning.bind(this);
        this.error = this.error.bind(this);
        this.debug = this.debug.bind(this);
        this.logToFile = deprecate(this.logToFile.bind(this), "'<Logger>.logToFile' is deprecated. Use '<Logger>.createFileWriteStream()' instead.");
        this.createFileWriteStream = this.createFileWriteStream.bind(this);
        this.setDebugMode = this.setDebugMode.bind(this);
        this.setName = this.setName.bind(this);
        this.setWriteStream = this.setWriteStream.bind(this);
        this.closeWriteStream = this.closeWriteStream.bind(this);
        this.clone = this.clone.bind(this);
    }

    public emit<K extends keyof LoggerEvents>(eventName: K, ...args: LoggerEvents[K]): boolean;
    public emit<K extends string | symbol>(eventName: K, ...args: any): boolean;
    public emit(eventName: string|symbol, ...args: any[]): boolean {
        const emitted = super.emit(eventName, ...args);
        if (this.parent) this.parent.emit(eventName, ...args);

        return emitted;
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

    /**
     * @deprecated Use {@link Logger.createFileWriteStream} instead
     */
    public logToFile(filePath: string, keepOldFile: boolean = false, renameFileName?: string|((stat: Stats) => string)): this {
        if (this.writeStream) throw new Error('Logger write stream already exist.');

        const filePathInfo = path.parse(filePath);

        mkdirSync(filePathInfo.dir, { recursive: true });

        if (existsSync(filePath) && !keepOldFile) {
            const fileInfo = lstatSync(filePath);
            const dateFormat = `${fileInfo.birthtime.toDateString()} - ${fileInfo.birthtime.getHours()}-${fileInfo.birthtime.getMinutes()}-${fileInfo.birthtime.getSeconds()}-${fileInfo.birthtime.getMilliseconds()}`;

            renameSync(filePath, path.join(filePathInfo.dir, renameFileName
                ? typeof renameFileName === 'string'
                    ? renameFileName
                    : renameFileName(fileInfo)
                : `${dateFormat}${filePathInfo.ext}`));
        }

        this.setWriteStream(createWriteStream(filePath));

        return this;
    }

    public async createFileWriteStream(options: LoggerFileWriteStreamOptions): Promise<this> {
        if (this.writeStream?.write) throw new Error('Logger write stream already exist.');

        const file = path.resolve(options.file);
        const filePathInfo = path.parse(file);
        const isExists = existsSync(file);

        let oldFileHandled = false;

        if (isExists && options.renameOldFile !== false) {
            if (options.handleOldFile) {
                await Promise.resolve(options.handleOldFile(file));
            } else {
                const lines = (await readFile(file, 'utf-8')).split('\n');
                const header = lines[0]?.startsWith(`<[LOG - HEADER]> `) ? lines.shift() : undefined;
                const date = header ? new Date(Number(header.split('> ')[1])) : (await stat(file)).birthtime;
                const dateFormat = `${date.toISOString().substring(0, 10)} ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}-${date.getMilliseconds()}`;
                const newFile = path.join(filePathInfo.dir, `${dateFormat}${filePathInfo.ext}.gz`);

                const data = gzipSync(Buffer.from(lines.join('\n')));

                await writeFile(file, data);
                await rename(file, newFile);
            }

            oldFileHandled = true;
        } else {
            await mkdir(filePathInfo.dir, { recursive: true });
        }

        this.setWriteStream(createWriteStream(file, { encoding: 'utf-8' }));

        if (isExists && oldFileHandled) this.writeStream?.write(`<[LOG - HEADER]> ${Date.now()}\n`, 'utf-8');
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

    public setWriteStream(writeStream: WriteStream, close: boolean = true): this {
        if (this.writeStream && close) this.writeStream.close();

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
        const formatter = this.formatMessage
            ? (message: string) => (this.formatMessage!)(message, level, this)
            : this.formatMessageLines[level] ?? (e => e);

        if (!messages.length) this._write(formatter('', this), level);

        let lastAnsi = '';
        let lines = messages.map(msg => typeof msg === 'string' ? msg : inspect(msg, this.objectInspectOptions))
            .join(' ')
            .split('\n');

            lines = lines.map((msg, index) => {
                const previousLine: string|undefined = lines[index - 1];
                if (!previousLine) return formatter(msg, this);

                lastAnsi = previousLine.match(ansiRegex())?.pop() ?? lastAnsi;

                return formatter(lastAnsi + msg, this);
            });

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
            const strippedMessage = stripVTControlCharacters(message);
            this.writeStream?.write(`${strippedMessage}\n`, 'utf-8');
        }
    }
}