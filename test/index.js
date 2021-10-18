const util = require('../index.js');

console.log('Fallout util v' + util.version);

var question = util.ask("What is your name? ");
console.log("Your name is " + question);