const fs = require('fs');
const path = require('path');

var reader = function (filename) {
    var temppath = 'upload/' + filename + '.svg';
    // var fullpath = path.join(__dirname, temppath);
    try{
        fs.accessSync(temppath,fs.F_OK);
        var readerStream = fs.readFileSync(temppath,'utf-8');
        return readerStream;
    }catch (e){
        return null;
    }


}

module.exports = {reader}
