const loginRouter = require("./login") // 登录路由
const userRouter = require("./user") // 用户路由
const tableRouter = require("./table") // 表格组件路由（信息管理路由）
const emailRouter = require("./email") // 邮件管理路由
const analysisRouter = require("./analysis") // 统计分析路由
const settingRouter = require("./setting") // 系统设置路由
const fileRouter = require('./file')
const testRouter = require("./test") // 测试路由

const routes = (app) => {
  app.use("/api/login", loginRouter)
  app.use("/api/user", userRouter)
  app.use("/api/table", tableRouter)
  app.use("/api/email", emailRouter)
  app.use("/api/analysis", analysisRouter)
  app.use("/api/setting", settingRouter)
  app.use("/api/file", fileRouter)
  app.use("/api/test", testRouter)
}

module.exports = routes
