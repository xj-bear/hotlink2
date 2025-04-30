const express = require('express');
const router = express.Router();
const Hotsearch = require('../models/hotsearch');
const { Op } = require('sequelize');

/**
 * GET /api/hotsearch
 * 支持按平台、日期筛选，返回JSON格式数据
 */
router.get('/', async (req, res) => {
  try {
    const { platform, limit = 20, offset = 0, date } = req.query;
    const where = {};
    if (platform) where.platform = platform;
    // 日期筛选，查本地当天0点到23:59:59，避免时区问题
    if (date) {
      const start = new Date(date + 'T00:00:00');
      const end = new Date(date + 'T23:59:59');
      where.createdAt = { [Op.gte]: start, [Op.lte]: end };
    }
    // 查询时同平台同标题去重，按hotValue降序排序，兼容无hotValue时按rank
    const hotsearchList = await Hotsearch.findAll({
      where,
      attributes: [
        'id', 'platform', 'title', 'url', 'rank', 'hotValue', 'tname', 'desc', 'pic', 'createdAt',
        // 取同平台同标题的最大hotValue和最小rank
        [Hotsearch.sequelize.fn('MAX', Hotsearch.sequelize.col('hotValue')), 'maxHotValue'],
        [Hotsearch.sequelize.fn('MIN', Hotsearch.sequelize.col('rank')), 'minRank']
      ],
      group: ['platform', 'title'],
      order: [
        [Hotsearch.sequelize.literal('maxHotValue'), 'DESC'],
        [Hotsearch.sequelize.literal('minRank'), 'ASC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    res.json({
      code: 0,
      msg: 'success',
      data: hotsearchList
    });
  } catch (err) {
    console.error('热搜查询失败：', err);
    res.status(500).json({
      code: 1,
      msg: '服务器内部错误',
      data: []
    });
  }
});

module.exports = router; 