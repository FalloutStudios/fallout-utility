# Fallout-utility
Utility package for FalloutStudios projects

```
npm i fallout-utility
yarn add fallout-utility
pnpm add fallout-utility
```

### Quick start
<details>
    <summary>CommonJs</summary>

```js
const util = require("fallout-utility");
```
</details>
<details>
    <summary>ES Modules</summary>

```js
import utils from "fallout-utility";
```
</details>

### Logger Usage

```js
import { Logger, version } from 'fallout-utility';

const logger = new Logger();

// Log to file
logger.logToFile('./logs/latest.log');

// Logs like console.log but also puts content to a file
logger.log('Fallout util v' + version);

// Other log methods
logger.warn(`Warning!`); // alias for logger.warning
logger.warning(`Warning!`);

logger.err(`Error!`); // alias for logger.error
logger.error(`Error!`);

logger.debug(`Debug!`); // Logs messages only on debug mode
```