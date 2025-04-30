// 引入所需模块
const express = require('express'); // Web 框架
const cors = require('cors'); // 解决跨域问题
const dotenv = require('dotenv'); // 读取.env配置
const { Sequelize } = require('sequelize'); // ORM工具

// 读取.env文件中的配置
dotenv.config();

// 创建Express应用
const app = express();
app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析JSON请求体

// 从环境变量读取数据库配置
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// 初始化Sequelize实例，连接MySQL数据库
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false // 关闭SQL日志，便于初学者阅读控制台
});

// 测试数据库连接
sequelize.authenticate()
  .then(() => {
    console.log('数据库连接成功！');
  })
  .catch(err => {
    console.error('数据库连接失败：', err);
  });

// 预留API路由（后续会完善）
app.get('/', (req, res) => {
  res.send('热搜爬虫系统已启动！');
});

// 挂载API路由
const hotsearchRouter = require('./routes/hotsearch');
app.use('/api/hotsearch', hotsearchRouter);

// 引入定时任务，服务启动时自动开启定时爬取
require('./tasks/schedule');

// 启动服务，监听3000端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器已启动，监听端口 ${PORT}`);
});

// 导出app和sequelize，便于后续使用
module.exports = { app, sequelize }; 