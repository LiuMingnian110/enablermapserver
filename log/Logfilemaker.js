const fs = require('fs');
const config = require('../config/pathsetting')

const options = {
    flags: 'a',
    encoding: 'utf-8',
};

const logger = function (uid, time, messageJson) {
    var path = config.logfilepath + time;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    const stout = fs.createWriteStream(config.logfilepath + time + "/" + uid + '.log', options);
    const logger = new console.Console(stout);
    logger.log(messageJson);
};

module.exports = {
    logger
}
