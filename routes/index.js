const express = require('express');
const router = express.Router();
const {client} = require('../dao/RedisUtil');
const userpro = require('../dao/ProLogin');
const logger = require('../log/Logfilemaker');
const filereader = require('../log/Filereader');


//ログイン画面
router.get('/login', function (req, res, next) {
    res.render('login');
});

//人位置情報取得
router.get('/getlocation/:uid', async function (req, res, next) {
    const uid = req.params.uid;
    let result = await client.synGet(uid);
    res.json(result);
});

//人位置情報送信
router.post('/location/:uid', function (req, res, next) {
    const uid = req.params.uid;
    if (req.body.data != null) {
        logger.logger(uid, JSON.stringify(req.body.data));
        client.synPost(uid, req.body.data);
    }
    ;
    res.end();
});

//人過去位置情報送信
router.get('/historical/:uid', async function (req, res, next) {
    const result = await filereader.getFileData(req.params.uid).catch((err) => {
        return null;
    });
    if (result != null) {
        res.json(result.toString());
    } else {
        res.send(null);
    }
});

//ユーザー情報検索
router.get('/user/:uid', async function (req, res, next) {
    const result = await userpro.queryUserByUid(req.params.uid)
    res.send(result);
});

//ユーザ登録
router.post('/userinfo', async function (req, res, next) {
    // {
    //     "data":{"uid": "0000100100100100004",
    //     "mailAddress": "tao@enabler.co.jp",
    //     "password": "laotao13CV",
    //     "role": "1",
    //     "displayicon": "1",
    //     "displaycolor": "1"
    // }
    // }
    if(req.body.data != null) {
        const result = await userpro.insertUser(req.body.data);
        res.send(result);
    }else{
        res.send(null);
    }
});

//ユーザパスワード更新
router.post('/changepw', async function (req, res, next) {
    // {
    //     "data":{"uid": "0000100100100100004",
    //     "password": "laotao13CV",
    // }
    // }
    if(req.body.data != null) {
        const result = await userpro.updateUserPw(req.body.data);
        res.send(result);
    }else{
        res.send(null);
    }
});

//ユーザ登録パスワード認証
router.post('/loginbypd',  async function (req, res, next) {
    const result = await userpro.checker(req.body.data.uid);
    var dataString = JSON.stringify(result);
    var data = JSON.parse(dataString);
    if(req.body.data.password == data[0].upassword){
        res.send("success");
    }else{
        res.status(400);
    }
});

//MainPage
router.get('/mainmap', function (req,res,next){
   res.render('map') ;
});

module.exports = router;
