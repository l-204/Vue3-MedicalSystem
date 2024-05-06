// 创建路由对象，并编写路由，然后导出
const express = require("express")
const router = express.Router()

// 导入用户逻辑
const userController = require('../controller/UserController')

// 上传头像
router.post('/avatar/:id', userController.upload)

// 导入路由对象
module.exports = router
