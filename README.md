<h1 align="center">
    fallout-utility
    <br>
</h1>

<h3 align="center">
    <a href="https://npmjs.org/package/fallout-utility">
        <img src="https://img.shields.io/npm/v/fallout-utility?label=npm">
    </a>
    <a href="https://github.com/thenorthsolution/fallout-utility">
        <img src="https://img.shields.io/npm/dt/fallout-utility?maxAge=3600">
    </a>
    <br>
    <div style="padding-top: 1rem">
        <a href="https://discord.gg/https://discord.gg/2QTnr78C7R">
            <img src="https://discord.com/api/guilds/993105237000855592/embed.png?style=banner2">
        </a>
    </div>
</h3>


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
import { Logger } from 'fallout-utility/Logger';

const logger = new Logger();

// Log to file
await logger.createFileWriteStream({
    file: './logs/latest.log'
});

// Logs like console.log but also puts content to a file
logger.log('Fallout util');

// Other log methods
logger.warn(`Warning!`); // alias for logger.warning
logger.warning(`Warning!`);

logger.err(`Error!`); // alias for logger.error
logger.error(`Error!`);

logger.debug(`Debug!`); // Logs messages only on debug mode
```