const chalk = require('chalk');
const { getCommand, Logger, LogLevels } = require('fallout-utility');

const logger = new Logger({
    colorMessages: {
        [LogLevels.WARN]: (message) => chalk.red(message)
    },
    enableDebugMode: true,
    loggerName: 'E'
});

logger.logFile('./logs/log.txt')

logger.log(getCommand('!e this is a "string mf". wtf you want?', '!'));
logger.warn(require('fallout-utility'));
logger.error(require('fallout-utility'));
logger.debug(require('fallout-utility'));