import { Logger, LoggerLevel, kleur } from 'fallout-utility';

const logger = new Logger({
    name: 'Hello',
    formatMessage: (message, level, logger) => `${LoggerLevel[level] + (logger.name ? (' ' + logger.name) : '')}: ${message}`
});

await logger.createFileWriteStream({
    file: './logs/latest.log'
});

logger.log(kleur.cyan(`Log`));
logger.warn(kleur.yellow(`Warn`));
logger.err(kleur.red(`Err`));