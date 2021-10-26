# Fallout-utility
Utility module for Fallout repositories

```
npm i fallout-utility
```

### Quick start
```js
const util = require("fallout-utility");
```

### Get version
```js
console.log(util.version);
```

### Example

```js
const { Logger, ask, version } = require('../index.js');

const log = new Logger();
log.log('Fallout util v' + version);

var question = ask("What is your name? ");
log.log("Your name is " + question);
```

```yml
1: Fallout util v1.0.37
2: What is your name? AMOGUS
3: Your name is AMOGUS
```
