// 创建路由对象，并编写路由，然后导出
const express = require("express")
const router = express.Router()

const dbConfig = require('../config/dbConfig') // 数据库配置文件
const mysql = require('mysql');
const pool = mysql.createPool(dbConfig); // 创建数据库连接池

// 通用查询接口（单表）
router.get('/select/:tableName', (req, res) => {
    let tableName = req.params.tableName;

    const selectQuery = `SELECT * FROM ${tableName}`;
    pool.query(selectQuery, (err, results) => {
        if (err) throw err;
        res.status(200).json(results)
    })
})

// 通用查询接口（多表）
router.post('/select', (req, res) => {
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
router.post('/search', (req, res) => {
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
router.delete('/delete/:id/:tableName', (req, res) => {
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
router.post('/insert/:tableName', (req, res) => {
    const tableName = req.params.tableName
    const data = req.body;

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
router.post('/update/:id/:tableName', (req, res) => {
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

module.exports = router