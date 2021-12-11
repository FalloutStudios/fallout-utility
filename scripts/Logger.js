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
    }

    log(message = null, prefix = this.defaultPrefix) { return make(message, prefix, 0); };
    warn(message = null, prefix = this.defaultPrefix) { return make(message, prefix, 1); };
    error(message = null, prefix = this.defaultPrefix) { return make(message, prefix, 2); };
}

// Functions
function logger(message, prefix = null, level = 0) {
    if(level < 0 || level > 2) throw new Error("Invalid level number");

    prefix = prefix != null ? "[%prefix% - " + prefix + "] " : "[%prefix%]";
    var levelName = 'INFO';

    switch(true) {
        case (level == 0):
            if(typeof message == 'string') { 
                console.log(replacePrefix(prefix, levelName) + ' ' + message);
            } else {
                console.log(replacePrefix(prefix, levelName));
                console.log(message);
            }
            break;
        case (level == 1):
            levelName = 'WARN';
            if(typeof message == 'string') { 
                console.warn('\x1b[33m%s\x1b[0m', replacePrefix(prefix, levelName) + ' ' + message);
            } else {
                console.warn('\x1b[33m%s\x1b[0m', replacePrefix(prefix, levelName));
                console.log(message);
            }
            break;
        case (level == 2):
            levelName = 'ERROR';
            if(typeof message == 'string') { 
                console.error('\x1b[31m%s\x1b[0m', replacePrefix(prefix, levelName) + ' ' + message);
            } else {
                console.error('\x1b[31m%s\x1b[0m', replacePrefix(prefix, levelName));
                console.log(message);
            }
            break;
        default:
            throw new Error("Invalid console level: " + level);
    }

    function replacePrefix (string, prefixName) {
        return replaceAll(string, '%prefix%', prefixName);
    }
}
function make(message, prefix = null, level = 0){
    if(typeof message == 'string') { 
        message = message.split('\n');

        for (let value of message) {
            logger(value.trim(), prefix, level);

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
            case 0:
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
            console.log('\x1b[0m');
        }
    }
}

// console logger with prefix