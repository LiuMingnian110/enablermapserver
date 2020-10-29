const express = require('express');
const router = express.Router();
const {client} = require('../dao/RedisUtil');
const logger = require('../log/logfilemaker');
const filereader = require('../log/filereader');


router.get('/getlocation/:uid', async function (req, res, next) {
    const uid = req.params.uid;
    let result = await client.synGet(uid);
    res.json(result);
});

router.post('/location/:uid', function (req, res, next) {
    const uid = req.params.uid;
    if (req.body != null) {
        logger.logger(uid, JSON.stringify(req.body));
        client.synPost(uid, req.body);
    }
    ;
    res.end();
});

router.get('/historical/:uid',  async function (req, res, next) {
    const result = await filereader.getFileData(req.params.uid).catch((err)=>{
        return null;
    });
    if(result != null){
        res.json(result.toString());
    }else{
        res.send(null);
    }
});

module.exports = router;
