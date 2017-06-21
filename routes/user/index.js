//引入express框架
const express = require('express');
const route = express.Router();
const db = require('../../model/db');
//获取图书模型
var Book = db.Book;
//获取学生图书模型
var StudentBook = db.StudentBook;


//书籍借阅路由
route.get('/borrow',(req,res)=>{
    //获取当前用户的id
    var uid = req.session.userId;
    var bid = req.query.bookId;
    //获取当前时间
    var now = Date.now();
    //filter是查询条件
    var filter = {sId: uid,bId: bid};
    //更新数据
    var update = {sId: uid,bId: bid,borrowDate: now};
    StudentBook.findOneAndUpdate(filter,update,{upsert: true}).then(function(data){
        if(data){
            res.json({status: 400,msg: '你已借过该书！'});
        }else{
            res.json({status: 200,msg: '借阅成功，请查看！'});
        }
    }).catch(function(err){
        console.log(err);
    });
});

//个人中心展示路由
route.get('/person',(req,res)=>{
    //获取用户ID
    var uid = req.session.userId;
    //populate做的是表关联操作,sort方法进行排序，其中的负号代表倒叙(这里把borrowDate从大到小排序)
    StudentBook.find({sId: uid}).populate('bId').sort('-borrowDate').then(function(data){
        res.render('user/person',{data: data,userId: uid});
    }).catch(function(err){
        console.log(err);
    });
});

//取消借阅路由
route.get('/cancel',(req,res)=>{
    var uid = req.session.userId;
    var bid = req.query.bid;
    StudentBook.findOneAndRemove({sId: uid,bId: bid}).then(function(data){
        if(data){
            res.json({status: 200,msg: '删除成功！'});
        }else{
            res.json({status: 400,msg: '删除失败！'});
        }
    }).catch(function(err){
        console.dir(err);
    });
});

//主页展示路由
route.get('/:page?',(req,res)=>{
    var currentPage = 1;
    if(req.params.page){
        currentPage = req.params.page*1;
    }
    var uid = null;
    // 判断用户是否登录
    if(req.session.userId){
        uid = req.session.userId;
    }
    Book.count({}).then(function(total){
        var totalPage = Math.ceil(total/12);
        Book.find({}).limit(12).skip(currentPage*12).then(function(data){
            res.render('./user/index',{userId: uid,books: data,cPage: currentPage,totalPage: totalPage});
        }).catch(function(err){
            console.log(err);
        });
    }); 
});


//路由模块导出
module.exports = route;