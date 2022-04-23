import * as Util from '../';

const Logger = new Util.Logger(undefined, {
    stringifyJSON: false,
    addPrefixToEveryJsonNewLines: true
}).logFile('./logs/log.txt');

Logger.log(Util);

Logger.log('Hello World');
Logger.info('Hello World');
Logger.warn('Hello World');
Logger.error(require('../../package.json'));

Logger.log(Util.replaceAll('Replace', 'e', 'i'));
Logger.log(Util.replaceAll('Replace', ['e','c'], ['i','o']));

setTimeout(() => {
    const e = Util.input({
        text: 'Input: ',
        repeatIfEmpty: false,
        exitStrings: ['exit', 'quit'],
        sigint: true,
    });
    Logger.log(e);
},1000);

Logger.log(Util.randomInt(10, 20));
Logger.log(Util.limitText('Hello World', 5));
Logger.log(Util.splitString('Hello World, "e e e e "  e e e, "e , e, e"', true));
Logger.log(Util.splitString('Hello World, "e e e e "  e e e, "e , e, e"', true, ','));
Logger.log(Util.getRandomKey([1,2,3,4,5,6,7,8,9,10]));
Logger.log(Util.detectCommand('/Hello World', '/'));
Logger.log(Util.getCommand('/Hello eee,eee,"eee,ee,ee",eee', '/', ','));
Logger.warn(Util.getOperatingSystem());
Logger.error(new Error('error'));

Logger.log(Util.version);
Logger.log(Logger.debugging ? 'Debugging' : 'Debugging is disabled');
Logger.debug('Debugging');