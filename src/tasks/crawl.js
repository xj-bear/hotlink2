// 爬虫任务文件
// 本文件整合了所有平台爬虫的执行与数据存储逻辑
// 适合初学者，所有关键步骤均有详细注释

const { fetchAllPlatforms, fetchByPlatform } = require('../spiders');
const HotSearch = require('../models/hotsearch');
const { Op } = require('sequelize');

/**
 * 执行所有平台爬虫并将结果存入数据库
 * @returns {Promise<Object>} 爬虫执行结果统计
 */
async function crawlAllPlatforms() {
  console.log('开始执行全平台爬虫任务...');
  const startTime = Date.now();
  const result = {
    total: 0,
    success: 0,
    skipped: 0,
    platforms: {}
  };
  
  try {
    // 获取所有平台的热搜数据
    const allData = await fetchAllPlatforms();
    
    // 遍历每个平台的数据，存入数据库
    for (const [platform, items] of Object.entries(allData)) {
      console.log(`开始处理${platform}的${items.length}条热搜数据...`);
      
      result.platforms[platform] = {
        total: items.length,
        success: 0,
        skipped: 0
      };
      
      for (const item of items) {
        result.total++;
        
        try {
          // 检查今天是否已经有相同平台相同标题的记录
          const today = new Date().toISOString().slice(0, 10);
          const existingRecord = await HotSearch.findOne({
            where: {
              platform: item.platform,
              title: item.title,
              createdAt: {
                [Op.gte]: today
              }
            }
          });
          
          if (existingRecord) {
            // 如果已存在相同记录，则跳过
            console.log(`跳过已存在的记录: ${platform} - ${item.title}`);
            result.skipped++;
            result.platforms[platform].skipped++;
            continue;
          }
          
          // 将热搜数据存入数据库
          await HotSearch.create(item);
          result.success++;
          result.platforms[platform].success++;
        } catch (err) {
          console.error(`存储热搜数据失败(${platform}): ${item.title}`, err);
        }
      }
    }
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`全平台爬虫任务完成，耗时${duration}秒`);
    console.log(`总计: ${result.total}条, 成功: ${result.success}条, 跳过: ${result.skipped}条`);
    
    return result;
  } catch (err) {
    console.error('执行爬虫任务出错:', err);
    throw err;
  }
}

/**
 * 执行指定平台爬虫并将结果存入数据库
 * @param {string} platform 平台标识
 * @returns {Promise<Object>} 爬虫执行结果统计
 */
async function crawlPlatform(platform) {
  console.log(`开始执行${platform}爬虫任务...`);
  const startTime = Date.now();
  const result = {
    platform,
    total: 0,
    success: 0,
    skipped: 0
  };
  
  try {
    // 获取平台的热搜数据
    const items = await fetchByPlatform(platform);
    result.total = items.length;
    
    // 遍历数据，存入数据库
    for (const item of items) {
      try {
        // 检查今天是否已经有相同平台相同标题的记录
        const today = new Date().toISOString().slice(0, 10);
        const existingRecord = await HotSearch.findOne({
          where: {
            platform: item.platform,
            title: item.title,
            createdAt: {
              [Op.gte]: today
            }
          }
        });
        
        if (existingRecord) {
          // 如果已存在相同记录，则跳过
          console.log(`跳过已存在的记录: ${platform} - ${item.title}`);
          result.skipped++;
          continue;
        }
        
        // 将热搜数据存入数据库
        await HotSearch.create(item);
        result.success++;
      } catch (err) {
        console.error(`存储热搜数据失败(${platform}): ${item.title}`, err);
      }
    }
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`${platform}爬虫任务完成，耗时${duration}秒`);
    console.log(`总计: ${result.total}条, 成功: ${result.success}条, 跳过: ${result.skipped}条`);
    
    return result;
  } catch (err) {
    console.error(`执行${platform}爬虫任务出错:`, err);
    throw err;
  }
}

// 导出任务函数
module.exports = {
  crawlAllPlatforms,
  crawlPlatform
}; 