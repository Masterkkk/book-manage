const express = require('express');
const route = express.Router();
//引入数据模型
const db = require('../../model/db');
//获取学生数据模型
var Student = db.Student;


//登录处理
route.get('/login',(req,res)=>{
    res.render('user/login');
});

//登录判断处理
route.post('/login',(req,res)=>{
    console.log(req.body);
    var userName = req.body.user_name;
    var userPwd = req.body.user_pwd;
    if(userName == 'admin' && userPwd == 'admin'){
        req.session.userId = '1';
        res.json({status: 280,msg: '管理员登录成功，准备跳转...'});
    }else{
       Student.findOne({userName: userName},function(err,data){
            if(!data){
                res.json({status: 400,msg: '用户名不存在，请确认输入！'});
            }else{
                Student.findOne({userName: userName,password: userPwd},function(err,data2){
                    if(!data2){
                        res.json({status: 400,msg: '密码错误，请重新输入！'});
                    }else{
                        //将用户的id存到session中
                        req.session.userId = data2.id;
                        res.json({status: 200,msg: '登录成功，准备跳转...'});
                    }
                });
            }
        });
    }
});


//注册页面展示
route.get('/register',(req,res)=>{
    res.render('user/register');
});

//用户注册处理
route.post('/register',(req,res)=>{
    var user_info = req.body;
    //删除多余的重复密码(密码只要存一个)
    delete user_info.rePWD;
    //判断用户名是否重复(改用promise的方式进行数据库操作)
    Student.findOne({userName: user_info.userName}).then(function(data){
        if(data){
            res.json({status: 400,msg: '用户名已存在'});
        }else{
            //新建一条记录
            Student.create(user_info).then(function(data2){
                res.json({status: 200,msg: '注册成功'});
                //成功时用then，失败时执行catch
            }).catch(function(err2){
                console.log(err2);
                res.json({status: 400,msg: '注册失败'});
            });
        }
    }).catch(function(err){
        console.log(err);
        res.json({status: 400,msg: '注册失败'});
    });
});



//退出登录路由
route.get('/logout',(req,res)=>{
    req.session.userId = null;
    //页面的重定向
    res.redirect('/login');
});

//路由子模块的导出
module.exports = route;