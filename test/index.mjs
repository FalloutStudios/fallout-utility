import chalk from 'chalk';
import { Logger, LoggerLevel } from 'fallout-utility';

const logger = new Logger({
    name: 'Hi',
    formatMessageLines: {
        [LoggerLevel.WARN]: message => chalk.red(message)
    }
});

logger.logFile('./logs/latest.log');

logger.on('err', (message) => {
    console.log(message);
});

logger.err(await import('fallout-utility'));