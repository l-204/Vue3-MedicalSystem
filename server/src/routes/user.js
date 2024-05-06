// 创建路由对象，并编写路由，然后导出
const express = require("express")
const router = express.Router()

const dbConfig = require('../config/dbConfig') // 数据库配置文件
const mysql = require('mysql');
const pool = mysql.createPool(dbConfig); // 创建数据库连接池

// 查询对应用户
router.post('/select/username', (req, res) => {
    const username = req.body.username
    // 执行查询语句
    const selectquery = `SELECT * FROM users WHERE username = '${username}' `
    pool.query(selectquery, (err, results) => {
        if (err) throw err;
        res.status(200).json(results[0])
    })
});
// 查询用户id
router.get('/select/id', (req, res) => {
    // 执行查询语句
    const selectquery = `SELECT user_id FROM users`
    pool.query(selectquery, (err, results) => {
        if (err) throw err;
        const idList = results.map((item => item.user_id))
        res.status(200).json(idList)
    })
});
// 更新用户信息
router.post('/update', (req, res) => {
    const data = req.body
    const updatequery = `UPDATE users SET username='${data.username}',gender='${data.gender}',email='${data.email}',phone_number='${data.phone_number}',job_number='${data.job_number}' WHERE user_id='${data.user_id}'`
    pool.query(updatequery, (err, results) => {
        if (err) throw err;
        const selectquery = `SELECT * from users WHERE user_id='${data.user_id}'`
        pool.query(selectquery, (err, results) => {
            if (err) throw err;
            res.status(200).json(results[0])
        })
    })
})

// 更改用户头像
router.post(`/avatar`,(req,res) => {
    // console.log(req.body)
    const { id, url} = req.body
    const updateQuery = `UPDATE users SET avatar = '${url}' WHERE user_id = '${id}'`
    const selectQuery = `SELECT avatar FROM users WHERE user_id = '${id}'`
    pool.query(updateQuery, (err, results) => {
        if (err) throw err;
        pool.query(selectQuery, (err, results) => {
            if (err) throw err;
            res.status(200).json(results)
        })
    })
})

module.exports = router