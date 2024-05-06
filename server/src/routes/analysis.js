// 创建路由对象，并编写路由，然后导出
const express = require("express")
const router = express.Router()

const dbConfig = require('../config/dbConfig') // 数据库配置文件
const mysql = require('mysql');
const pool = mysql.createPool(dbConfig); // 创建数据库连接池

// 
router.get(`/:keyName/:tableName`, (req, res) => {
    const keyName = req.params.keyName
    const tableName = req.params.tableName
    const selectQuery = `SELECT ${keyName} FROM ${tableName}`
    pool.query(selectQuery, (err, results) => {
        if (err) throw err;
        res.status(200).json(results)
    })
})

module.exports = router