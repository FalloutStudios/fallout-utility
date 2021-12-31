/*

        dMMMMMP .aMMMb  dMP     dMP    .aMMMb  dMP dMP dMMMMMMP        dMP dMP dMMMMMMP dMP dMP 
       dMP     dMP"dMP dMP     dMP    dMP"dMP dMP dMP    dMP          dMP dMP    dMP   amr dMP  
      dMMMP   dMMMMMP dMP     dMP    dMP dMP dMP dMP    dMP          dMP dMP    dMP   dMP dMP   
     dMP     dMP dMP dMP     dMP    dMP.aMP dMP.aMP    dMP          dMP.aMP    dMP   dMP dMP    
    dMP     dMP dMP dMMMMMP dMMMMMP VMMMP"  VMMMP"    dMP           VMMMP"    dMP   dMP dMMMMMP

*/
const Fs = require("fs");
const Path = require("path");

const modulesDir = Fs.readdirSync(__dirname + '/scripts/').filter(file => file.endsWith('.js'));


module.exports = {
    ask: require('./scripts/ask.js'),
    detectCommand: require('./scripts/detectCommand.js'),
    escapeRegExp: require('./scripts/escapeRegExp.js'),
    getCommand: require('./scripts/getCommand.js'),
    getRandomKey: require('./scripts/getRandomKey.js'),
    isNumber: require('./scripts/isNumber.js'),
    limitText: require('./scripts/limitText.js'),
    Logger: require('./scripts/Logger.js'),
    loopString: require('./scripts/loopString.js'),
    makeSentence: require('./scripts/makeSentence.js'),
    randomInt: require('./scripts/randomInt.js'),
    replaceAll: require('./scripts/replaceAll.js'),
    splitString: require('./scripts/splitString.js'),
    version: require('./scripts/version.js'),
};