// 定时任务路由文件
// 本文件提供定时任务管理API，包括查看和修改定时任务频率
// 适合初学者，所有关键步骤均有详细注释

const express = require('express');
const router = express.Router();
const scheduleManager = require('../tasks/schedule');

/**
 * @api {get} /api/schedule 获取定时任务状态
 * @apiDescription 获取当前定时任务的状态和执行频率
 * @apiSuccess {Number} code 状态码，200表示成功
 * @apiSuccess {String} message 状态消息
 * @apiSuccess {Object} data 任务状态信息
 * @apiSuccess {Boolean} data.running 是否正在运行
 * @apiSuccess {String} data.cron cron表达式
 * @apiSuccess {String} data.description 易读的频率描述
 * @apiSuccess {String} data.nextRun 下次执行时间
 */
router.get('/', (req, res) => {
  try {
    // 获取当前定时任务状态
    const status = scheduleManager.getScheduleStatus();
    
    res.json({
      code: 200,
      message: 'success',
      data: status
    });
  } catch (err) {
    console.error('获取定时任务状态出错:', err);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      error: err.message
    });
  }
});

/**
 * @api {post} /api/schedule 设置定时任务频率
 * @apiDescription 设置定时任务的执行频率
 * @apiParam {String} type 频率类型：every2hours, every4hours, every8hours, everyday, custom
 * @apiParam {String} [cron] 自定义cron表达式，当type为custom时必须提供
 * @apiSuccess {Number} code 状态码，200表示成功
 * @apiSuccess {String} message 状态消息
 * @apiSuccess {Object} data 新的任务状态信息
 */
router.post('/', (req, res) => {
  try {
    const { type, cron } = req.body;
    let newCron;
    
    // 根据类型设置cron表达式
    switch (type) {
      case 'every2hours':
        newCron = '0 */2 * * *';
        break;
      case 'every4hours':
        newCron = '0 */4 * * *';
        break;
      case 'every6hours':
        newCron = '0 */6 * * *';
        break;
      case 'every8hours':
        newCron = '0 */8 * * *';
        break;
      case 'everyday':
        newCron = '0 0 * * *';
        break;
      case 'custom':
        if (!cron) {
          return res.status(400).json({
            code: 400,
            message: 'custom类型需要提供cron表达式'
          });
        }
        newCron = cron;
        break;
      default:
        return res.status(400).json({
          code: 400,
          message: '无效的频率类型'
        });
    }
    
    // 重新启动定时任务
    scheduleManager.startSchedule(newCron);
    
    // 获取新的任务状态
    const status = scheduleManager.getScheduleStatus();
    
    res.json({
      code: 200,
      message: 'success',
      data: status
    });
  } catch (err) {
    console.error('设置定时任务频率出错:', err);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      error: err.message
    });
  }
});

/**
 * @api {post} /api/schedule/run 立即执行一次爬虫任务
 * @apiDescription 立即触发一次全平台爬虫任务，不影响定时设置
 * @apiSuccess {Number} code 状态码，200表示成功
 * @apiSuccess {String} message 状态消息
 */
router.post('/run', async (req, res) => {
  try {
    // 立即执行
    res.json({
      code: 200,
      message: '已触发爬虫任务，正在后台执行'
    });
    
    // 异步执行，不阻塞响应
    scheduleManager.runOnce()
      .then(result => {
        console.log('手动触发爬虫任务成功:', result);
      })
      .catch(err => {
        console.error('手动触发爬虫任务失败:', err);
      });
  } catch (err) {
    console.error('执行爬虫任务出错:', err);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      error: err.message
    });
  }
});

/**
 * @api {post} /api/schedule/stop 停止定时任务
 * @apiDescription 停止当前正在运行的定时爬虫任务
 * @apiSuccess {Number} code 状态码，200表示成功
 * @apiSuccess {String} message 状态消息
 */
router.post('/stop', (req, res) => {
  try {
    const result = scheduleManager.stopSchedule();
    
    if (result) {
      res.json({
        code: 200,
        message: '定时任务已停止'
      });
    } else {
      res.json({
        code: 200,
        message: '没有正在运行的定时任务'
      });
    }
  } catch (err) {
    console.error('停止定时任务出错:', err);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      error: err.message
    });
  }
});

module.exports = router; 