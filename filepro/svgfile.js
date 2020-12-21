const multer = require('multer');
const path = require('path');
const config = require('../config/pathsetting')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.svg_storagepath)
        // cb(null, 'upload/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})


const upload = multer({storage: storage});


module.exports = upload;
