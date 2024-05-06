// 创建路由对象，并编写路由，然后导出
const express = require("express")
const router = express.Router()

const dbConfig = require('../config/dbConfig') // 数据库配置文件
const mysql = require('mysql');
const pool = mysql.createPool(dbConfig); // 创建数据库连接池

// 返回当前用户收到的所有邮件
router.get(`/user`,(req,res) => {

    const selectAllEmail = `SELECT * FROM email`

    pool.query(selectAllEmail,(err, results) => {
        if(err) throw err
        const emailList = results
        // 提取所有邮件的用户id，统计邮件所有用户id的范围
        let allId = emailList.reduce((acc, email) => {
            acc.push(email.from_id);
            acc.push(email.to_id);
            return acc;
        }, []);
        // 获取id范围后将作为post参数，用于只发送一次请求的情况下获取所有邮件的用户信息
        const min_id = Math.min(...allId);
        const max_id = Math.max(...allId);

        // 提取邮件所有user_id范围内的所有user信息
        const selectUserEmail = `SELECT user_id, username, avatar, email FROM users WHERE user_id BETWEEN ${ min_id } AND ${ max_id }`;

        pool.query(selectUserEmail,(err, results) => {
            if(err) throw err
            const userList = results

            // 创建一个新的 emailList 数组，其中每个邮件对象都包含了from_id和to对应的username, avatar, email
            const newEmailList = emailList.map(email => {
                const { username: from_name, avatar: from_avatar, email: from_email } = userList.find(user => user.user_id === email.from_id) || {};
                const { username: to_name, avatar: to_avatar, email: to_email } = userList.find(user => user.user_id === email.to_id) || {};
                return { ...email, from_name, from_avatar, from_email, to_name, to_avatar, to_email, checked: false };
            });
            res.status(200).json(newEmailList)
        })
    })
})

// 删除选中邮件
router.post('/selected',(req,res) => {
    const selectedEmails = req.body // 选中邮件
    // 选中邮件中状态为"垃圾"的邮件和邮件ID，进行删除操作
    const trashEmails = selectedEmails.filter(email => email.state === '垃圾');
    const trashEmailIds = trashEmails.map(email => email.id);
    // 选中邮件中状态不为"垃圾"的邮件和邮件ID，进行更新操作
    const notTrashEmails = selectedEmails.filter(email => email.state !== '垃圾');
    const notTrashEmailIds = notTrashEmails.map(email => email.id);
    const updateQuery = `UPDATE email SET state = '垃圾' WHERE id IN (${notTrashEmailIds.join(',')})`
    const deleteQuery = `DELETE FROM email WHERE id IN (${trashEmailIds.join(',')})`
    if (notTrashEmailIds.length !== 0){
        pool.query(updateQuery,(err, results) => {
            if(err) res.status(500).json({ message: '删除失败' });
            else res.status(200).json({ message: '已存放至垃圾箱内' });
        })
    }
    if (trashEmailIds.length !== 0){
        pool.query(deleteQuery,(err, results) => {
            if(err) res.status(500).json({ message: '删除失败' });
            else res.status(200).json({ message: '删除成功' });
        })
    }
})

module.exports = router