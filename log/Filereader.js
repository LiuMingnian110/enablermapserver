const fs = require('fs');

async function getFileData(uid){
    return filePromise = new Promise((resolve, reject) => {
        fs.readFile('./log/logfile/'+ uid + '.log', (err, data) => {
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