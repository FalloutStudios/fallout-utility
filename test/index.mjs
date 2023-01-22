import chalk from 'chalk';
import { Logger, LoggerLevel, unpromisify } from 'fallout-utility';
import { setTimeout } from 'timers/promises';

const logger = new Logger({
    name: 'Hi',
    formatMessageLines: {
        [LoggerLevel.WARN]: message => chalk.red(message)
    }
});

logger.logToFile('./logs/latest.log');
logger.err(await import('fallout-utility'));