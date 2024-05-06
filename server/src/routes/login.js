// 创建路由对象，并编写路由，然后导出
const express = require("express")
const router = express.Router()

const jwt = require('jsonwebtoken') // jwt鉴权

const dbConfig = require('../config/dbConfig') // 数据库配置文件
const mysql = require('mysql');
const pool = mysql.createPool(dbConfig); // 创建数据库连接池

// 注册接口
router.post('/register', (req, res) => {
    
    const { username, password } = req.body;

    const selectQuery = `SELECT * FROM users WHERE username='${username}'`;
    const insertQuery = `INSERT INTO users(username, password, avatar, gender, email, phone_number, identity, job_number, created_at, last_login_at) VALUES('${username}', '${password}', '', '', '', '',  '普通用户', '', NOW(), NOW())`;

    pool.query(selectQuery, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.status(400).json({ message: '用户名已存在' });
        } else {
            pool.query(insertQuery, (err, results) => {
                if (err) throw err;
                res.status(200).json({ message: '注册成功' });
            });
        }
    });
});

// 登录接口
router.post('/login', (req, res) => {

    const { username, password } = req.body;
    const updatequery = `UPDATE users SET last_login_at=NOW() WHERE username='${username}'`;
    const selectQuery = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;

    pool.query(updatequery, (err, results) => {
        if (err) throw err;
        pool.query(selectQuery, (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                const userInfo = results[0]
                // 设置路由守卫
                const payload = { username: username, password: password } //用户信息
                const secretKey = 'key' //密钥，可自定义
                const options = { expiresIn: '7days' } //token有效期，可自定义
                const token = jwt.sign(payload, secretKey, options); //生成token
                res.status(200).json({ message: '登录成功', token, secretKey, userInfo }); //返回token
            } else {
                res.status(400).json({ message: '用户名或密码错误' });
            }
        });
    });

});

module.exports = router