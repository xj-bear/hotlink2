// src/models/index.js
// 负责初始化并导出sequelize实例，供所有模型使用
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// 读取数据库配置
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// 初始化sequelize实例
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false // 关闭SQL日志
});

module.exports = sequelize; 