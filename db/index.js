//导入数据库模块
const mysql = require('mysql')

const db = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'123456',
    database:'my_db_1',
    port:3306
})

//向外共享数据库连接对象
module.exports = db