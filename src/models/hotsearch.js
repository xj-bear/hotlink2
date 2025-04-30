// 引入sequelize模块
const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // 修正：从index.js引入sequelize实例

/**
 * 热搜数据模型
 * 每条记录代表一个平台的一个热搜条目
 */
const Hotsearch = sequelize.define('Hotsearch', {
  // 主键，自增
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    comment: '主键ID'
  },
  // 平台名，如 bilibili、weibo
  platform: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '平台名称'
  },
  // 热搜标题
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '热搜标题'
  },
  // 热搜链接
  url: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '热搜链接'
  },
  // 排名，数字，越小越热
  rank: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '热搜排名'
  },
  // 热度值（有些平台有）
  hotValue: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '热度值（可选）'
  },
  // 入库时间，自动生成
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '入库时间'
  },
  // 内容分类ID
  tid: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '内容分类ID（部分平台有）'
  },
  // 内容分类名称
  tname: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '内容分类名称（部分平台有）'
  },
  // 简介/描述
  desc: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '简介/描述（部分平台有）'
  },
  // 封面图片地址
  pic: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '封面图片URL（部分平台有）'
  }
}, {
  tableName: 'hotsearch', // 数据库表名
  timestamps: false // 不自动生成updatedAt字段
});

// 同步模型到数据库（自动建表）
Hotsearch.sync()
  .then(() => {
    console.log('热搜表已准备好（如不存在会自动创建）');
  })
  .catch(err => {
    console.error('热搜表创建失败：', err);
  });

module.exports = Hotsearch; 