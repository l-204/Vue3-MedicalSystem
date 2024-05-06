// 创建路由对象，并编写路由，然后导出
const express = require("express")
const router = express.Router()

const dbConfig = require('../config/dbConfig') // 数据库配置文件
const mysql = require('mysql');
const pool = mysql.createPool(dbConfig); // 创建数据库连接池

// 测试
router.get('/test', (req, res) => {
    console.log(req.body)
    res.status(200).json({message:'收到！'})
})

module.exports = router