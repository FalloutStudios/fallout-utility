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