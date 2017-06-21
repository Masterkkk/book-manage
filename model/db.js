//引入mongoose模块操作mongoDB数据库
const db = require('mongoose');
//改用nodejs自带的promise
db.Promise = global.Promise;
//连接数据库
db.connect('mongodb://localhost/work/');


//创建数据集合
var studentSchemas = db.Schema({
    userName: String,
    password: String,
    name: String,
    gender: String,
    birthday: {
        type: Date,
        default: Date.now
    },
    phone: String,
    email: String
});

//自定义集合方法
studentSchemas.methods.getbirthday = function(){
    var year = this.birthday.getFullYear();
    var month = this.birthday.getMonth() + 1;
    var date = this.birthday.getDate();
    return (year + '-' + month + '-' + date);
}

//自定义集合方法，获取年龄
studentSchemas.methods.getAge = function(){
    var now = new Date();
    return (now.getFullYear() - this.birthday.getFullYear());
}

//模型映射
var Student = db.model('Student',studentSchemas);

var bookSchema = db.Schema({
    name: String,
    image: String,
    author: String,
    link: String,
    publisher: String,
    price: Number,
    type: String
});

//创建模型映射
var Book = db.model('Book',bookSchema);


//创建学生图书数据集合
var StudentBookSchema = db.Schema({
    //相当于关系型数据库中的外键，连接的是Student表
    sId: {
        type: db.Schema.Types.ObjectId,
        ref: 'Student'
    },
    //关联到Book表里面的id
    bId: {
        type: db.Schema.Types.ObjectId,
        ref: 'Book'
    },
    borrowDate: {
        type: Date,
        default: Date.now
    }
});


//自定义集合方法
StudentBookSchema.methods.getBorrowDate = function(){
    var year = this.borrowDate.getFullYear();
    var month = this.borrowDate.getMonth() + 1;
    var date = this.borrowDate.getDate();
    var hour = this.borrowDate.getHours();
    return (year + '-' + month + '-' + date + '-' + hour);
}

//学生图书模型映射
var StudentBook = db.model('StudentBook',StudentBookSchema);

//模块导出
module.exports = {
    Student: Student,
    Book: Book,
    StudentBook: StudentBook
}