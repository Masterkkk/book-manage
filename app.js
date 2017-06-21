var express = require('express');
var path = require('path');
//引入日志模块
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');


var app = express();

//配置art-template模板引擎
var template = require('art-template');
template.config('base','');
template.config('extname','.html');
app.engine('.html',template.__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//配置cookie解析
app.use(cookieParser('123'));
app.use(session({
    name: 'testApp',
    secret: '123',
    resave: true,
    saveUninitialized: false
}));
//配置静态资源目录
app.use(express.static(path.join(__dirname, 'public')));


//登录模块路由
app.use('/', require('./routes/user/login'));
//主页路由
app.use('/user',require('./routes/user/index'));
//管理员路由
app.use('/manage',require('./routes/admin/manage'));



//错误处理
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
