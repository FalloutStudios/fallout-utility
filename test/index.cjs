const { getCommand, Logger } = require('fallout-utility');

const logger = new Logger();

logger.log(getCommand('!e this is a "string mf". wtf you want?', '!'));
logger.warn(require('fallout-utility'));