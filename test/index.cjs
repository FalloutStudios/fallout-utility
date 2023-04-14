const kleur = require('kleur');
const { Logger, LoggerLevel } = require('fallout-utility');

const logger = new Logger({
    name: 'Hi',
    formatMessageLines: {
        [LoggerLevel.WARN]: message => kleur.red(message)
    }
});

logger.logFile('./logs/latest.log');
logger.err(require('fallout-utility'));