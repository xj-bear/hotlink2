// src/tasks/schedule.js
// 定时任务：定时爬取Bilibili热搜并去重
// 运行方法：require本文件即可自动启动定时任务

const schedule = require('node-schedule');
const fetchBilibiliHotsearch = require('../spiders/bilibili');
const Hotsearch = require('../models/hotsearch');
const { crawlAllPlatforms } = require('./crawl');

/**
 * 判断当天是否已存在相同平台+标题的热搜
 * @param {string} platform 平台名
 * @param {string} title 热搜标题
 * @returns {Promise<boolean>} 是否已存在
 */
async function isDuplicateToday(platform, title) {
  // 获取北京时间当天0点
  const now = new Date();
  const bjOffset = 8 * 60 * 60 * 1000; // 北京时间偏移
  const today = new Date(now.getTime() + bjOffset);
  today.setUTCHours(0, 0, 0, 0);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  // 查询当天是否有相同平台+标题
  const count = await Hotsearch.count({
    where: {
      platform,
      title,
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    }
  });
  return count > 0;
}

/**
 * 定时任务：每天8:01自动爬取Bilibili热搜
 */
schedule.scheduleJob('0 */2 * * *', async () => {
  console.log('定时任务启动：开始爬取Bilibili热搜...');
  const items = await fetchBilibiliHotsearch();
  let insertCount = 0;
  for (const item of items) {
    const exists = await isDuplicateToday(item.platform, item.title);
    if (!exists) {
      await Hotsearch.create(item);
      insertCount++;
    }
  }
  console.log(`定时任务完成：本次新增${insertCount}条Bilibili热搜。`);
});

// 存储当前定时任务对象
let currentJob = null;

// 存储当前的cron表达式
let currentCron = '0 */2 * * *'; // 默认每2小时执行一次

/**
 * 启动定时爬虫任务
 * @param {string} cron cron表达式，默认每2小时执行一次
 * @returns {Object} 定时任务对象
 */
function startSchedule(cron = '0 */2 * * *') {
  // 如果已有任务在运行，先停止
  if (currentJob) {
    currentJob.cancel();
    console.log('已停止旧的定时任务');
  }
  
  // 更新当前cron表达式
  currentCron = cron;
  
  console.log(`正在启动定时爬虫任务，规则: ${cron}`);
  
  // 创建新的定时任务
  currentJob = schedule.scheduleJob(cron, async function() {
    console.log(`定时任务触发：${new Date().toLocaleString()}`);
    
    try {
      // 执行爬虫任务
      const result = await crawlAllPlatforms();
      console.log('定时爬虫任务执行完毕。');
      console.log(`总计: ${result.total}条, 成功: ${result.success}条, 跳过: ${result.skipped}条`);
    } catch (err) {
      console.error('定时爬虫任务执行出错:', err);
    }
  });
  
  console.log('定时爬虫任务已启动');
  
  return currentJob;
}

/**
 * 停止定时爬虫任务
 */
function stopSchedule() {
  if (currentJob) {
    currentJob.cancel();
    currentJob = null;
    console.log('定时爬虫任务已停止');
    return true;
  }
  return false;
}

/**
 * 获取当前定时任务状态
 * @returns {Object} 任务状态信息
 */
function getScheduleStatus() {
  return {
    running: !!currentJob,
    cron: currentCron,
    // 将cron表达式转换为易读的文字描述
    description: cronToDescription(currentCron),
    nextRun: currentJob ? currentJob.nextInvocation() : null
  };
}

/**
 * 将cron表达式转换为易读的文字描述
 * @param {string} cron cron表达式
 * @returns {string} 易读的文字描述
 */
function cronToDescription(cron) {
  // 解析cron表达式
  const parts = cron.split(' ');
  const minute = parts[0];
  const hour = parts[1];
  
  // 根据常见的cron规则转换为文字描述
  if (minute === '0' && hour === '0') {
    return '每天0点执行';
  } else if (minute === '0' && hour === '*/2') {
    return '每2小时执行';
  } else if (minute === '0' && hour === '*/4') {
    return '每4小时执行';
  } else if (minute === '0' && hour === '*/6') {
    return '每6小时执行';
  } else if (minute === '0' && hour === '*/8') {
    return '每8小时执行';
  } else if (minute === '0' && hour === '*/12') {
    return '每12小时执行';
  } else {
    return `自定义规则: ${cron}`;
  }
}

/**
 * 立即执行一次爬虫任务
 * @returns {Promise<Object>} 爬虫执行结果
 */
async function runOnce() {
  console.log('手动触发爬虫任务...');
  try {
    const result = await crawlAllPlatforms();
    console.log('手动触发爬虫任务完成');
    return result;
  } catch (err) {
    console.error('手动触发爬虫任务出错:', err);
    throw err;
  }
}

// 导出函数
module.exports = {
  startSchedule,
  stopSchedule,
  getScheduleStatus,
  cronToDescription,
  runOnce
}; 