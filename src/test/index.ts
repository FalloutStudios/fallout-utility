import { Logger } from '../scripts/Logger.js';
import { splitString } from '../scripts/splitString.js';

const logger = new Logger({
        stringifyJSON: true,
        addPrefixToAllNewLines: true
    })
    .logFile('./logs/latest.log');

logger.log(splitString('eeee ee ee e e "e ,e \'e .e .e" .e e. . . ^ + _ `', true));