const express = require('express');
const route = express.Router();
const db = require('../../model/db');
//引入学生表模型
var Student = db.Student;
//引入学生图书列表
var StudentBook = db.StudentBook;


//管理员主页面路由
route.get('/',(req,res)=>{
    var uid = req.session.userId || null;
    //防止直接使用浏览器地址栏的途径进入管理员界面
    if(!uid || uid != '1'){
        res.redirect('/user/');
    }
    Student.find({}).then(function(data){
        // console.log(data);
        res.render('admin/list',{data: data});
    }).catch(function(err){
        console.dir(err);
    });
});

//用户详情路由
route.get('/detail',(req,res)=>{
    var uid = req.query.uid;
    Student.findById(uid).then(function(data){
        StudentBook.find({sId: uid}).populate('bId').then(function(bData){
            res.render('admin/detail',{user: data,books: bData});
        }).catch(function(err){
            console.log(err);
        });
    }).catch(function(err2){
        console.log('外层错误信息：');
        console.log(err2);
    });
});




//路由模块导出
module.exports = route;