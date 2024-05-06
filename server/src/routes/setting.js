// 创建路由对象，并编写路由，然后导出
const express = require("express")
const router = express.Router()

const dbConfig = require('../config/dbConfig') // 数据库配置文件
const mysql = require('mysql');
const pool = mysql.createPool(dbConfig); // 创建数据库连接池

// 更改权限
router.get('/:id/:isAdmin', (req, res) => {
    const isAdmin = req.params.isAdmin;
    const id = req.params.id;

    let updateQuery = ``
    const selectQuery = `SELECT * FROM users WHERE user_id = ${id}`
    if (isAdmin == 'true') {
        updateQuery = `UPDATE users SET identity='管理员' WHERE user_id=${id} `
    } else {
        updateQuery = `UPDATE users SET identity='普通用户' WHERE user_id=${id} `
    }
    pool.query(updateQuery, (err, results) => {
        if (err) throw err;
        pool.query(selectQuery, (err, results) => {
            if (err) throw err;
            res.json(results)
        })
    })
})

module.exports = router