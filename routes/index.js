const express = require('express');
const router = express.Router();
const {client} = require('../dao/RedisUtil');
const userpro = require('../dao/ProLogin');
const logger = require('../log/Logfilemaker');
const filereader = require('../log/Filereader');
const upload = require('../filepro/svgfile');
const {reader} = require('../filepro/getmap');


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
        res.send(result.toString());
    } else {
        res.send(null);
    }
});

//ユーザー情報検索
router.get('/user/:pnumber', async function (req, res, next) {
    const result = await userpro.queryUserByUid(req.params.pnumber)
    res.send(result);
});

//ユーザ登録
// router.post('/userinfo', async function (req, res, next) {
//     // {
//     //     "data":{"uid": "0000100100100100004",
//     //     "mailAddress": "tao@enabler.co.jp",
//     //     "password": "laotao13CV",
//     //     "role": "1",
//     //     "displayicon": "1",
//     //     "displaycolor": "1"
//     // }
//     // }
//     if (req.body.data != null) {
//         const result = await userpro.insertUser(req.body.data);
//         res.send(result);
//     } else {
//         res.send(null);
//     }
// });

//ユーザパスワード更新
router.post('/changepw', async function (req, res, next) {
    // {
    //     "data":{"pnumber": "00004",
    //     "password": "laotao13CV",
    // }
    // }
    if (req.body.data != null) {
        const result = await userpro.confrimPw(req.body.data);
        var dataString = JSON.stringify(result);
        var data = JSON.parse(dataString);
        if (data[0].pwd == req.body.data.current) {
            const result1 = await userpro.updateUserPw(req.body.data);
            res.send(result1);
        }else{
            res.send(null);
        }
    } else {
        res.send(null);
    }
});

//ユーザ登録パスワード認証
router.post('/loginbypd', async function (req, res, next) {
    const result = await userpro.checker(req.body.data.mail);
    if (result.length == 0) {
        res.status(400);
    } else {
        var dataString = JSON.stringify(result);
        var data = JSON.parse(dataString);
        if (req.body.data.pwd == data[0].pwd) {
            const result1 = await userpro.checkerpnumber(data[0].pnumber);
            if (result1.length != 0) {
                var str = req.body.data.pcompanycode + req.body.data.pcountry + req.body.data.poffice + req.body.data.pdep + data[0].pnumber;
                req.session.isLogin = 1;
                res.setHeader('Set-Cookie', ['enabermap.uid=' + str]);
                res.send(str);
            } else {
                res.status(400);
            }
        } else {
            res.status(400);
        }
    }

});

//MainPage
router.get('/mainmap', function (req, res, next) {
    if (req.session.isLogin == 1) {
        res.render('map');
    } else {
        res.redirect('http://localhost:3000/login');
    }
});

//HistoryPage
router.get('/historymap', function (req, res, next) {
    res.render('historyshow');
});

//SVG File UpLoad
router.post('/singleUpload', upload.single('mapsvg'), function (req, res, next) {
    console.log(req.file);
    res.end("success");
});

//GET SVG MAP 廃棄、使用しない
// router.get('/getmap/:mapname.svg', function (req, res, next) {
//     res.send(reader(req.params.mapname))
// });

//GET USERLIST
router.get('/getuserlist', async function (req, res, next) {
    const result = await userpro.getuserlist();
    if (result.length == 0) {
        res.status(400);
    } else {
        res.send(result);
    }
});

//企業情報取得
router.get('/getcompanydetail/:companyNo', async function (req, res, next) {
    const result = await userpro.getcompanydetail(req.params.companyNo);

    res.send(result);
});

//indoormap
router.get('/getindoordetail/:companyNo', async function (req, res, next) {
    const result = await userpro.getindoordetail(req.params.companyNo);

    res.send(result);
});


module.exports = router;
