// API路由文件
// 本文件提供多平台热搜查询API功能，支持按平台、日期、分页等条件查询
// 适合初学者，所有关键步骤均有详细注释

const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const HotSearch = require('../models/hotsearch');
const { getAllPlatforms } = require('../spiders');
const { crawlPlatform } = require('../tasks/crawl');

/**
 * @api {get} /api/hotsearch 获取热搜列表
 * @apiDescription 获取热搜列表，支持按平台、日期、分页等条件查询
 * @apiParam {String} [platform] 平台名称，如bilibili、weibo等
 * @apiParam {String} [date] 日期，格式YYYY-MM-DD，默认当天
 * @apiParam {Number} [limit=50] 返回条数，默认50
 * @apiParam {Number} [offset=0] 开始位置，默认0
 * @apiSuccess {Number} code 状态码，200表示成功
 * @apiSuccess {String} message 状态消息
 * @apiSuccess {Object} data 返回数据
 * @apiSuccess {Array} data.list 热搜列表
 * @apiSuccess {Number} data.total 总条数
 */
router.get('/hotsearch', async (req, res) => {
  try {
    // 获取查询参数
    const platform = req.query.platform;
    const date = req.query.date || new Date().toISOString().slice(0, 10);
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    // 构建查询条件
    const where = {};
    
    // 如果指定了平台，添加平台条件
    if (platform) {
      where.platform = platform;
    }
    
    // 添加日期条件，查询指定日期的数据
    where.createdAt = {
      [Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`]
    };
    
    // 查询数据库
    const result = await HotSearch.findAndCountAll({
      where,
      limit,
      offset,
      order: [
        ['hotValue', 'DESC'], // 按热度降序
        ['rank', 'ASC'] // 其次按排名升序
      ]
    });
    
    // 处理结果，去重（同一平台同标题只保留热度最高的）
    const uniqueMap = new Map();
    result.rows.forEach(item => {
      const key = `${item.platform}-${item.title}`;
      if (!uniqueMap.has(key) || uniqueMap.get(key).hotValue < item.hotValue) {
        uniqueMap.set(key, item);
      }
    });
    const uniqueItems = Array.from(uniqueMap.values());
    
    // 返回结果
    res.json({
      code: 200,
      message: 'success',
      data: {
        list: uniqueItems,
        total: result.count
      }
    });
  } catch (err) {
    console.error('获取热搜列表出错:', err);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      error: err.message
    });
  }
});

/**
 * @api {get} /api/platforms 获取支持的平台列表
 * @apiDescription 获取系统支持的所有热搜平台列表
 * @apiSuccess {Number} code 状态码，200表示成功
 * @apiSuccess {String} message 状态消息
 * @apiSuccess {Array} data 平台列表
 */
router.get('/platforms', async (req, res) => {
  try {
    const platforms = getAllPlatforms();
    res.json({
      code: 200,
      message: 'success',
      data: platforms
    });
  } catch (err) {
    console.error('获取平台列表出错:', err);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      error: err.message
    });
  }
});

/**
 * @api {post} /api/crawl 手动触发爬虫任务
 * @apiDescription 手动触发指定平台的爬虫任务
 * @apiParam {String} platform 平台名称，如bilibili、weibo等
 * @apiSuccess {Number} code 状态码，200表示成功
 * @apiSuccess {String} message 状态消息
 * @apiSuccess {Object} data 任务执行结果
 */
router.post('/crawl', async (req, res) => {
  try {
    const platform = req.body.platform;
    
    // 检查平台是否有效
    const platforms = getAllPlatforms();
    if (!platform || !platforms.includes(platform)) {
      return res.status(400).json({
        code: 400,
        message: '无效的平台',
        data: {
          supportPlatforms: platforms
        }
      });
    }
    
    // 执行爬虫任务
    const result = await crawlPlatform(platform);
    
    // 返回结果
    res.json({
      code: 200,
      message: 'success',
      data: result
    });
  } catch (err) {
    console.error('手动触发爬虫任务出错:', err);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      error: err.message
    });
  }
});

module.exports = router; 