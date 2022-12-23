const chalk = require('chalk');
const { Logger, LoggerLevel } = require('fallout-utility');

const logger = new Logger({
    name: 'Hi',
    formatMessageLines: {
        [LoggerLevel.WARN]: message => chalk.red(message)
    }
});

logger.logFile('./logs/latest.log');
logger.err(require('fallout-utility'));