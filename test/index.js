const Util = require('../index.js');

const log = new Util.Logger('test');
log.log('Fallout util v' + Util.version);
log.error('Fallout util v' + Util.version);
log.warn('Fallout util v' + Util.version);
log.info('Fallout util v' + Util.version);

log.log(Util);
log.error(Util);
log.warn(Util);
log.info(Util);

log.log(new Error('Test error'));
log.error(new Error('Test error'));
log.warn(new Error('Test error'));
log.info(new Error('Test error'));

log.log(new TypeError('Test error'));
log.error(new TypeError('Test error'));
log.warn(new TypeError('Test error'));
log.info(new TypeError('Test error'));