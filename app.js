const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const lessMiddleware = require('less-middleware');
const logger = require('morgan');
const indexRouter = require('./routes/index');


const app = express();

app.set('views',path.join(__dirname,'public'));
const ejs = require('ejs');
app.engine('html',ejs.__express);
app.set('view engine','html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public'),{index:"login.html"}));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, sessionToken');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method.toLowerCase() == 'options') {
        res.send(200);
    } else {
        next();
    }
});

app.use('/', indexRouter);

module.exports = app;
