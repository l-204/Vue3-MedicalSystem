const express = require('express');
const app = express(); // 创建 app 实例
const port = 8889; // 配置端口

// 注册中间件
require("./src/config/middlewareConfig")(app)

// 静态托管 public 目录
app.use('/public/',express.static('./src/public'));

app.listen(port, () => console.log(`服务启动中, 端口号: ${port}`));
