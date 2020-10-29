const fs = require('fs');

const options = {
    flags: 'a',
    encoding: 'utf-8',
};

const logger = function (uid, messageJson) {
    const stout = fs.createWriteStream('./log/logfile/' + uid + '.log', options);
    const logger = new console.Console(stout);
    logger.log(messageJson);
};

module.exports = {
    logger
}