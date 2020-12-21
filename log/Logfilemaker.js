const fs = require('fs');
const config = require('../config/pathsetting')

const options = {
    flags: 'a',
    encoding: 'utf-8',
};

const logger = function (uid, messageJson) {
    const stout = fs.createWriteStream(config.logfilepath + uid + '.log', options);
    const logger = new console.Console(stout);
    logger.log(messageJson);
};

module.exports = {
    logger
}
