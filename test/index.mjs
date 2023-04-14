import kleur from 'kleur';
import { Logger, LoggerLevel } from 'fallout-utility';

const logger = new Logger({
    name: 'Hi',
    formatMessageLines: {
        [LoggerLevel.WARN]: message => kleur.red(message)
    }
});

logger.logToFile('./logs/latest.log');
logger.err(await import('fallout-utility'));