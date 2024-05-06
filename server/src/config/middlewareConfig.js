// 专门注册中间件

const express = require("express")
const bodyParser = require("body-parser")
const cors = require('cors')


// 这里 export 是一个方法，app就是方法入参，app是在app.js 中传入的
module.exports = app => {
  // 日志插件
  // console.log("中间件")

  // CORS跨域
  let corsOpt = {
    origin: "*",
    optionsSuccessStatus: 200
  }
  app.use(cors(corsOpt))

  // 解析请求体数据
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // 路由
  require("../routes")(app)
  
  // .... 可继续添加其他中间件
}
