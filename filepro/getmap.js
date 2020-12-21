const fs = require('fs');
const path = require('path');
const config = require('../config/pathsetting')

var reader = function (filename) {
    var temppath = config.svg_textpath + filename + '.svg';
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
