const replaceAll = require('./replaceAll');
const fs = require('fs');
const path = require('path');

module.exports = class Logger {
    /**
     * 
     * @param {string} defaultPrefix - Prefix name for log messages
     */
    constructor (defaultPrefix) {
        this.defaultPrefix = defaultPrefix;
        this.writeStream = null;
    }

    /**
     * 
     * @param {string} logFilePath - Path to log file
     * @param {string} override - Override log file if exist
     */
    logFile(logFilePath, override = false) {
        if(!logFilePath) throw new Error("Log file path is not defined");

        const dir = path.dirname(logFilePath);
        const file = path.basename(logFilePath);
        const header = `[LOG HEADER] ${new Date().toJSON()}\n[LOG] Original file: ${file}\n[LOG] Original path: ${dir}\n`;

        if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        if(!fs.existsSync(logFilePath)) {
            this.writeStream = fs.createWriteStream(logFilePath);
        } else {
            if(!override) {
                const fileInfo = path.parse(file);
                const headerInfo = this.parseLogHeader(fs.readFileSync(logFilePath, 'utf8')).map(line => line.replace('[LOG HEADER] ', ''));
                fs.renameSync(logFilePath, path.join(dir, `${headerInfo[0]}${fileInfo.ext}`));
            }

            this.writeStream = fs.createWriteStream(logFilePath);
        }

        this.writeStream.write(header);
        return this;
    }

    stopLogWriteStream() {
        if(this.writeStream) { this.writeStream.end(); this.writeStream = null; }
        return this;
    }

    /**
     * 
     * @param {string} log - Parsed log
     * @returns 
     */
    parseLogHeader(log) {
        return log.split('\n').filter(line => line.startsWith('[LOG HEADER]'));
    }

    log(message = null, prefix = this.defaultPrefix) { return this._parseMessage(message, prefix, 0); }
    info(message = null, prefix = this.defaultPrefix) { return this._parseMessage(message, prefix, 0); }
    warn(message = null, prefix = this.defaultPrefix) { return this._parseMessage(message, prefix, 1); }
    error(message = null, prefix = this.defaultPrefix) { return this._parseMessage(message, prefix, 2); }

    /**
     * 
     * @param {string} message - Message to log
     * @param {string} prefix - Log message prefix
     * @param {int} level - Log level
     * @returns 
     */
    _parseMessage(message, prefix = null, level = 0){
        if(typeof message == 'string') { 
            message = message.split('\n');
    
            for (let value of message) {
                this._writeLog(value.trim(), prefix, level);
            }
            return;
        }
        this._writeLog(message, prefix, level);
    }

    _writeLog(message, prefix = null, level = 0) {
        if(level < 0 || level > 2) throw new TypeError("Invalid level number");
    
        prefix = prefix != null ? "[%prefix% - " + prefix + "] " : "[%prefix%]";
        var levelName = 'INFO';
        var color = null;
    
        switch(level) {
            case 0: break;
            case 1:
                levelName = 'WARN';
                color = '\x1b[33m';
                break;
            case 2:
                levelName = 'ERROR';
                color = '\x1b[31m';
                break;
            default:
                throw new TypeError("Invalid console level: " + level);
        }

        levelName = replaceAll(prefix, '%prefix%', levelName);
        if(typeof message == 'string') {
            console.log((color ? color + levelName : levelName), message, '\x1b[0m');
        } else {
            console.log((color ? color + levelName : levelName));
            console.log(message);

            // convert instance of errors to string
            if(message instanceof Error) {
                message = message.stack;
            } else if(typeof message == 'object') {
                message = JSON.stringify(message);
            }
        }

        if(this.writeStream) {
            this.writeStream.write(levelName +' ' + message + '\n', 'utf-8');
        }
    }
}

// console logger with prefix