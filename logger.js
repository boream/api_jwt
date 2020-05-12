const bunyan = require('bunyan');

const logger = bunyan.createLogger({
    name: 'my-first-api',
    level: 'debug'
});

module.exports = logger;