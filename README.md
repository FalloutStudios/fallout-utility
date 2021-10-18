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
const util = require("fallout-utility");

console.log('Fallout util v' + util.version);

var question = util.ask("What is your name? ");
console.log("Your name is " + question);
```
```yml
1: Fallout util v1.0.1
2: What is your name? AMOGUS
3: Your name is AMOGUS
```
