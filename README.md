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
const { Logger, input, version } = require('../index.js');

const log = new Logger();
log.log('Fallout util v' + version);

var question = input("What is your name? ");
log.log("Your name is " + question);
```

```yml
1: [INFO] Fallout util v1.2.6
2: What is your name? AMOGUS
3: [INFO] Your name is AMOGUS
```
