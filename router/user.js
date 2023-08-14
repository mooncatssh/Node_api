const express =require('express')
const router = express.Router()
//导入路由函数处理模块
const userHandle =require('../router_handle/user')
// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { reg_login_schema } = require('../schema/user')

//注册用户
router.post('/reguser',expressJoi(reg_login_schema),userHandle.reguser)
//登录
router.post('/login',expressJoi(reg_login_schema),userHandle.login)

module.exports = router 
