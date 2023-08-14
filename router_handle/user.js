//导入数据库
const db =require('../db/index')
//导入 bcryptjs
const bcrypt = require('bcryptjs')
//导入token的包
const jwt = require('jsonwebtoken')
//导入全局的配置文件
const config = require('../config')
//注册新用户的处理函数
exports.reguser = (req,res) =>{
    //获取客户端提交到服务器的用户信息
    const userinfo = req.body
// 判断数据是否合法
if (!userinfo.username || !userinfo.password) {

    return res.send({ status: 1, message: '用户名或密码不能为空！' })
  }
  //定义sql语句，看是否被占用
  const sql = `SELECT * FROM ev_users WHERE username=?`
  db.query(sql,userinfo.username,(err,result)=>{
    if(err){
        
        return res.cc(err) /* res.send({sattus: 1 ,message:err.message}) */
    }
    if(result.result>0){
        return res.cc('用户名已更换')  /* res.send({sattus: 1 ,message:'用户名已更换'}) */
    }
    //查询成功
   /*  res.send({result}) */
    // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
userinfo.password = bcrypt.hashSync(userinfo.password, 10)
//定义插入的sql语句
const sql = 'insert into ev_users set ?'
db.query(sql, { id: userinfo.id,username: userinfo.username, password: userinfo.password },(err, results)=> {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)  /* res.send({ status: 1, message: err.message }) */
    // SQL 语句执行成功，但影响行数不为 1
    if (results.affectedRows !== 1) {
      return  res.cc('注册用户失败，请稍后再试！') /* res.send({ status: 1, message: '注册用户失败，请稍后再试！' }) */
    }
    // 注册成功
    /* res.send({ status: 0, message: '注册成功！' }) */
    res.cc('注册成功！',0)
  })
  })
}

exports.login =(req,res) =>{
    //接受表单数据
const userinfo = req.body
//定义sql语句
const sql = `select * from ev_users where username=?`
//执行sql语句，根据用户名查询用户信息
db.query(sql,userinfo.username,(err,result)=>{
    if(err) return res.cc(err)
    if(result.length!==1) return res.cc('登录失败')
//判断密码是否一致
// 拿着用户输入的密码,和数据库中存储的密码进行对比
const compareResult = bcrypt.compareSync(userinfo.password,result[0].password)
console.log(result[0].password);
console.log(userinfo.password);
console.log(compareResult);
// 如果对比的结果等于 false, 则证明用户输入的密码错误
if (!compareResult) return res.cc('登录失败！')
const user ={...result[0],password:'',user_pic:''}
// 生成 Token 字符串
const tokenStr = jwt.sign(user, config.jwtSecretKey, {
    expiresIn: '10h', // token 有效期为 10 个小时
  })
  //将生成的 Token 字符串响应给客户端：
res.send({
    status: 0,
    message: '登录成功！',
    // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
    token: 'Bearer ' + tokenStr,
  })
})
}