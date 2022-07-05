import { Logger } from '../scripts/Logger';

const logger = new Logger({
        stringifyJSON: true
    })
    .logFile('./logs/latest.log');

logger.warn('hi', 'hello', { 'hi': 'e' }, function e() {}, 1, 2, 4, 3, ['3','4','5']);