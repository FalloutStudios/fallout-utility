const Util = require('../index.js');

const log = new Util.Logger('test');
console.log(Util.input({ text: 'Hello! ', echo: '*', repeat: true, exitStrings: [] }));

Util.makeSentence(['hello', 'world']);