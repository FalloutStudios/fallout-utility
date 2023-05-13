import { Logger, LoggerLevel } from 'fallout-utility';

const logger = new Logger({
    name: 'Hello',
    formatMessage: (message, level, logger) => `${LoggerLevel[level] + (logger.name ? (' ' + logger.name) : '')}: ${message}`
});

await logger.createFileWriteStream({
    file: './logs/latest.log'
});

logger.log(`Log`);
logger.warn(`Warn`);
logger.err(`Err`);