const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const mysql = require('mysql');
const jwt = require('jsonwebtoken')
const router = require('./src/router/index')

const app = express(); // 创建 app 实例
const port = 8889; // 配置端口

app.use(cors()) // 开启跨域支持
app.use(bodyParser.json()) // 解析表单
app.use(bodyParser.urlencoded({ extended: true })) // 解析表单
app.use('/api', router) // 注册路由
app.use('/public/', express.static('./public/')) // 开启静态资源服务

// 创建数据库连接池
const pool = mysql.createPool({
    host: '47.107.117.115',
    user: 'demo',
    password: 'demo',
    database: 'demo',
});

// 注册接口
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM users WHERE username='${username}'`;
    pool.query(query, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.status(400).json({ message: '用户名已存在' });
        } else {
            const insertQuery = `INSERT INTO users(username, password, avatar, gender, email, phone_number, identity, job_number, created_at, last_login_at) VALUES('${username}', '${password}', '', '', '', '',  '普通用户', '', NOW(), NOW())`;
            pool.query(insertQuery, (err, results) => {
                if (err) throw err;
                res.status(200).json({ message: '注册成功' });
            });
        }
    });
});

// 登录接口
app.post('/api/login', (req, res) => {

    const { username, password } = req.body;
    const updatequery = `UPDATE users SET last_login_at=NOW() WHERE username='${username}'`;
    pool.query(updatequery, (err, results) => {
        if (err) throw err;
        const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
        pool.query(query, (err, results) => {
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

// 用户接口
app.post('/api/users', (req, res) => {
    const username = req.body.username
    // 执行查询语句
    const selectquery = `SELECT * FROM users WHERE username = '${username}' `
    pool.query(selectquery, (err, results) => {
        if (err) throw err;
        res.status(200).json(results[0])
    })
});

app.post('/api/users/update', (req, res) => {
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

// 用户接口
app.get('/api/users/id', (req, res) => {
    // 执行查询语句
    const selectquery = `SELECT user_id FROM users`
    pool.query(selectquery, (err, results) => {
        if (err) throw err;
        const idList = results.map((item => item.user_id))
        res.status(200).json(idList)
    })
});

// 通用查询接口（单表）
app.get('/api/all/select/:tableName', (req, res) => {
    let tableName = req.params.tableName;

    const selectQuery = `SELECT * FROM ${tableName}`;
    pool.query(selectQuery, (err, results) => {
        if (err) throw err;
        res.status(200).json(results)
    })
})

// 通用查询接口（多表）
app.post('/api/all/select', (req, res) => {
    let tableName = req.body;

    const getTableData = (table) => {
        return new Promise((resolve, reject) => {
            selectQuery = `SELECT * FROM ${table}`;
            pool.query(selectQuery, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    };

    const tableDataPromises = tableName.map(table => getTableData(table));

    Promise.all(tableDataPromises)
        .then(results => {
            res.status(200).json(results);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
})

// 通用搜索接口
app.post('/api/all/search', (req, res) => {
    const tableName = req.body[0]
    const keywords = req.body[1]
    const searchword = req.body[2]
    let selectQuery = ``;

    if (searchword.length > 0) {
        selectQuery = `SELECT * FROM ${tableName} WHERE ${keywords} = '${searchword}'`
    } else {
        selectQuery = `SELECT * FROM ${tableName}`
    }
    pool.query(selectQuery, (err, results) => {
        if (err) throw err;
        res.status(200).json(results)
    })
})

// 通用删除接口
app.delete('/api/all/delete/:id/:tableName', (req, res) => {
    const tableName = req.params.tableName
    const id = req.params.id
    
    const selectQuery = `SELECT * FROM ${tableName}`
    const deleteQuery = `DELETE FROM ${tableName} WHERE id = ${id}`
    pool.query(deleteQuery, (err, results) => {
        if (err) throw err;
        pool.query(selectQuery, (err, results) => {
            if (err) throw err;
            res.status(200).json(results)
        })
    })
})

// 通用添加接口
app.post('/api/all/insert/:tableName', (req, res) => {
    const tableName = req.params.tableName
    const data = req.body;
    console.log(data)

    const selectQuery = `SELECT * FROM ${tableName}`
    let insertQuery = ``;
    if (tableName == '') {
        insertQuery = ``
    }
    // 患者接口
    else if (tableName == 'patients') {
        insertQuery = `INSERT INTO ${tableName}( patient_name, gender,age,phone_number,created_at,last_modified_at) VALUES( '${data.patient_name}','${data.gender}','${data.age}','${data.phone_number}', NOW(), NOW())`;
    }
    // 医生接口
    else if (tableName == 'doctors') {
        insertQuery = `INSERT INTO ${tableName}( doctor_name, gender, age, phone_number, title, specialty, schedule_info, created_at, last_modified_at) VALUES('${data.doctor_name}','${data.gender}','${data.age}','${data.phone_number}','${data.title}','${data.specialty}','${data.schedule_info}',NOW(), NOW())`;
    }
    // 科室接口
    else if (tableName == 'rooms') {
        insertQuery = `INSERT INTO ${tableName}( room_name, room_head, created_at, last_modified_at) VALUES( '${data.room_name}','${data.room_head}',NOW(), NOW())`;
    }
    // 病历接口
    else if (tableName == 'medical_records') {
        insertQuery = `INSERT INTO ${tableName}( patient_name, doctor_name,doctor_id,record_content,record_results,created_at,last_modified_at) VALUES( '${data.patient_name}','${data.doctor_name}','${data.doctor_id}','${data.record_content}','${data.record_results}', NOW(), NOW())`;
    }
    // 药品接口
    else if (tableName == 'medicines') {
        insertQuery = `INSERT INTO ${tableName}(medicine_name, medicine_brand, medicine_company, specification, unit_price, approval_number, storage, created_at, last_modified_at) VALUES('${data.medicine_name}', '${data.medicine_brand}','${data.medicine_company}','${data.specification}','${data.unit_price}','${data.approval_number}','${data.storage}',NOW(), NOW())`;
    }
    // 手术接口
    else if (tableName == 'surgeries') {
        insertQuery = `INSERT INTO ${tableName}(doctor_name, doctor_id, patient_name, surgery_name,created_at, last_modified_at) VALUES('${data.doctor_name}', '${data.doctor_id}','${data.patient_name}','${data.surgery_name}',NOW(), NOW())`;
    }
    // 护理接口
    else if (tableName == 'nursing') {
        insertQuery = `INSERT INTO ${tableName}(nurse_name, gender, age, phone_number, title, patient_name, nursing_content, created_at, last_modified_at) VALUES('${data.nurse_name}','${data.gender}','${data.age}','${data.phone_number}','${data.title}','${data.patient_name}','${data.nursing_content}',NOW(), NOW())`;
    }


    // 邮箱接口
    else if (tableName == 'email') {
        insertQuery = `INSERT INTO ${tableName}(from_id, to_id, topic, content, attachment, state, send_at, receive_at) VALUES(${data.from_id},${data.to_id},'${data.topic}','${data.content}','${data.attachment}','${data.state}',NOW(), NOW())`;
    }
    // 其他接口
    else {
        return
    }
    pool.query(insertQuery, (err, results) => {
        if (err) throw err;
        pool.query(selectQuery, (err, results) => {
            if (err) throw err;
            res.status(200).json(results)
        })
    })
})

// 通用编辑接口
app.post('/api/all/update/:id/:tableName', (req, res) => {
    const tableName = req.params.tableName
    const id = req.params.id
    const data = req.body;

    const selectQuery = `SELECT * FROM ${tableName}`
    let updateQuery = ``;

    if (tableName == '') {
        updateQuery = ``
    }
    // 患者接口
    else if (tableName == 'patients') {
        updateQuery = `UPDATE ${tableName} SET patient_name='${data.patient_name}',gender='${data.gender}',age='${data.age}',phone_number='${data.phone_number}',last_modified_at=NOW() WHERE id='${id}'`
    }
    // 医生接口
    else if (tableName == 'doctors') {
        updateQuery = `UPDATE ${tableName} SET doctor_id='${data.doctor_id}',doctor_name='${data.doctor_name}',gender='${data.gender}',age='${data.age}', phone_number='${data.phone_number}' ,title='${data.title}',specialty='${data.specialty}',schedule_info='${data.schedule_info}', last_modified_at=NOW() WHERE id='${id}'`
    }
    // 科室接口
    else if (tableName == 'rooms') {
        updateQuery = `UPDATE ${tableName} SET room_id='${data.room_id}',room_name='${data.room_name}',room_head='${data.room_head}',last_modified_at=NOW() WHERE id='${id}'`;
    }
    // 病历接口
    else if (tableName == 'medical_records') {
        updateQuery = `UPDATE ${tableName} SET patient_name='${data.patient_name}',doctor_name='${data.doctor_name}',doctor_id='${data.doctor_id}',record_content='${data.record_content}',record_results='${data.record_results}',last_modified_at=NOW() WHERE id='${id}'`
    }
    // 药品接口
    else if (tableName == 'medicines') {
        updateQuery = `UPDATE ${tableName} SET medicine_name='${data.medicine_name}',medicine_brand='${data.medicine_brand}',medicine_company='${data.medicine_company}',specification='${data.specification}', unit_price='${data.unit_price}' ,approval_number='${data.approval_number}',storage='${data.storage}', last_modified_at=NOW() WHERE id='${id}'`
    }
    // 手术接口
    else if (tableName == 'surgeries') {
        updateQuery = `UPDATE ${tableName} SET doctor_name='${data.doctor_name}',doctor_id='${data.doctor_id}',patient_name='${data.patient_name}',surgery_name='${data.surgery_name}',last_modified_at=NOW() WHERE id='${id}'`;
    }
    // 护理接口
    else if (tableName == 'nursing') {
        updateQuery = `UPDATE ${tableName} SET nurse_id='${data.nurse_id}',nurse_name='${data.nurse_name}',gender='${data.gender}',age='${data.age}', phone_number='${data.phone_number}' ,title='${data.title}',patient_name='${data.patient_name}',nursing_content='${data.nursing_content}', last_modified_at=NOW() WHERE id='${id}'`;
    }

    // 其他接口
    else {
        return
    }
    pool.query(updateQuery, (err, results) => {
        if (err) throw err;
        pool.query(selectQuery, (err, results) => {
            if (err) throw err;
            res.status(200).json(results)
        })
    })

})

// 系统设置

// 更改权限
app.get('/api/setting/:id/:isAdmin', (req, res) => {
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

// 统计分析
app.get(`/api/analysis/:keyName/:tableName`, (req, res) => {
    const keyName = req.params.keyName
    const tableName = req.params.tableName
    const selectQuery = `SELECT ${keyName} FROM ${tableName}`
    pool.query(selectQuery, (err, results) => {
        if (err) throw err;
        res.status(200).json(results)
    })
})

// 图片
app.post(`/api/users/avatar`,(req,res) => {
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

// 邮箱
app.get(`/api/email/user`,(req,res) => {

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
                return { ...email, from_name, from_avatar, from_email, to_name, to_avatar, to_email };
            });
            res.status(200).json(newEmailList)
        })
    })
})


app.listen(port, () => console.log(`Server running on port ${port}`));
