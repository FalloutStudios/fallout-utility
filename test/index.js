const Util = require('../index.js');

const log = new Util.Logger();
log.log('Fallout util v' + Util.version);

let int = Util.randomInt(0, 1);
let _0 = false;
let _1 = false;
let i = 0;

while (!_0 || !_1) {
    i++;
    console.log(int, _0, _1, i);
    switch (int) {
        case 0:
            _0 = true;
            break;
        case 1:
            _1 = true;
            break;
    }

    int = Util.randomInt(0, 1);
}