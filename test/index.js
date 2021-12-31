const Util = require('../index.js');

const log = new Util.Logger('test');
Util.ask({ text: 'Hello! ', echo: '*', repeat: true, exitStrings: [] });

Util.makeSentence(['hello', 'world']);