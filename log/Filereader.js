const fs = require('fs');
const config = require('../config/pathsetting')

async function getFileData(date, uid) {
    return filePromise = new Promise((resolve, reject) => {
        fs.readFile(config.logfilepath + date + "/" + uid + '.log', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        })
    });
}

module.exports = {
    getFileData
}
