import { default as chalk } from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

interface OptionsPrexisInsterface {
    enabled: boolean;
    startBracket: string;
    endBracket: string;
    separator: string;
    levels: string[];
    colors: string[];
}

interface OptionsInterface {
    prefix?: OptionsPrexisInsterface;
    stringifyJSON?: boolean;
    writeStream?: fs.WriteStream;
}

type LevelNumbers = 0 | 1 | 2;

export class Logger {

    public options: OptionsInterface = {
        stringifyJSON: false,
        writeStream: undefined,
        prefix: {
            enabled: true,
            startBracket: '[',
            endBracket: ']',
            separator: ' - ',
            levels: ['INFO', 'WARN', 'ERROR'],
            colors: ['', '\x1b[33m', '\x1b[31m']
        },
    };
    public defaultPrefix: string;
    public writeStream: fs.WriteStream | undefined;

    constructor(defaultPrefix: string, options?: OptionsInterface) {
        this.options = options || this.options;
        this.defaultPrefix = defaultPrefix;
        this.writeStream = options?.writeStream || undefined;
    }

    logFile(logFilePath: string, overwriteOldFile: boolean = false): Logger {
        if(!logFilePath) throw new TypeError("Log file path is not defined");

        const dir = path.dirname(logFilePath);
        const file = path.basename(logFilePath);
        const header = `[LOG HEADER] ${new Date().toJSON()}\n[LOG] Original file: ${file}\n[LOG] Original path: ${dir}\n`;

        let overwriten = false;
        if(fs.existsSync(logFilePath)) {
            if (!overwriteOldFile) {
                const fileInfo = path.parse(file);
                const headerInfo = this.parseLogHeader(fs.readFileSync(logFilePath, 'utf8')).map(line => line.replace('[LOG HEADER] ', ''));
                fs.renameSync(logFilePath, path.join(dir, `${headerInfo[0] || new Date().toJSON() + '-1'}${fileInfo.ext}`));
                overwriten = true;
            }
        } else {
            fs.mkdirSync(dir, { recursive: true });
        }

        this.writeStream = fs.createWriteStream(logFilePath);
        if (overwriten) this.writeStream.write(header);
        
        return this;
    }

    stopLogWriteStream(): Logger {
        if(!this.writeStream) return this;
        
        this.writeStream.end();
        this.writeStream = undefined;

        return this;
    }

    private parseLogHeader(log: string): string[] {
        return log.split('\n').filter(line => line.startsWith('[LOG HEADER]'));
    }

    log (args: any, setPrefix: string = this.defaultPrefix): void { return this.parseLogMessage(args, setPrefix, 0); }
    info (args: any, setPrefix: string = this.defaultPrefix): void { return this.parseLogMessage(args, setPrefix, 0); }
    warn (args: any, setPrefix: string = this.defaultPrefix): void { return this.parseLogMessage(args, setPrefix, 1); }
    error (args: any, setPrefix: string = this.defaultPrefix): void { return this.parseLogMessage(args, setPrefix, 2); }

    private parseLogMessage (message: any, setPrefix: string = this.defaultPrefix, level: LevelNumbers = 0): void {
        if (typeof message === 'string') {
            message = message.split('\n');
            
            for (let value of message) {
                this.writeLog(value, setPrefix, level);
            }
            return;
        }

        this.writeLog(message, setPrefix, level);
    }

    private writeLog (message: any, prefix: string = this.defaultPrefix, level: LevelNumbers = 0): void {
        const consolePrefix = this.getPrefix(prefix, level);
        const consolePrefixText = this.getPrefix(prefix, level, false);

        if (typeof message === 'string' || typeof message === 'number') {
            console.log(consolePrefix, `${message}`, '\x1b[0m');
        } else if (typeof message === 'object' && this.options.stringifyJSON) {
            this.parseLogMessage(JSON.stringify(message, null, 2), prefix, level);
            return;
        } else if (message instanceof Error) {
            console.log(consolePrefix, `${message.stack}`, '\x1b[0m');
        } else {
            console.log(consolePrefix, '\x1b[0m');
            console.log(message);
            console.log('\x1b[0m');
        }

        if (this.writeStream) {
            this.writeStream.write(`${consolePrefixText} ${message}\n`, 'utf-8');
        }
    }

    private getPrefix(prefix: string, level: LevelNumbers = 0, colors: boolean = true): string {
        if (this.options.prefix?.enabled === false) return '';

        const levelPrefix = this.options.prefix?.levels[level] || (['INFO', 'WARN', 'ERROR'])[level];
        const color = this.options.prefix?.colors[level] || (['', '\x1b[33m', '\x1b[31m'])[level];

        return (colors ? color : '') + `${ this.options.prefix?.startBracket || '[' }${levelPrefix}`+ (prefix ? `${ this.options.prefix?.separator || ' - ' }${prefix}` : ``) + `${ this.options.prefix?.endBracket || ']' }`;
    }
}