const kleur = require('kleur');
const { Logger, LoggerLevel } = require('fallout-utility');
const { inspect } = require('util');

const logger = new Logger({
    name: 'Hi',
    formatMessageLines: {
        [LoggerLevel.ERROR]: msg => `${kleur.red('ERROR:')} ${msg}`
    }
});

logger.err(kleur.blue('Hello!\nBitch\nLMFHD'), kleur.yellow(inspect(new Error('Hi'))));
logger.err(kleur.red(inspect(new Error('Bitch'))));