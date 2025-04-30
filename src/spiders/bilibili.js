// 引入所需模块
const axios = require('axios');
const cheerio = require('cheerio'); // 用于解析HTML
const Hotsearch = require('../models/hotsearch'); // 热搜数据模型
const fs = require('fs'); // 新增：用于写文件

/**
 * 只设置User-Agent，模拟Go代码方式抓取Bilibili热搜
 */
async function fetchBilibiliHotsearch() {
  try {
    // 官方API地址
    const url = 'https://api.bilibili.com/x/web-interface/ranking/v2?rid=0&type=all';
    // 只设置User-Agent
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
      }
    });
    const data = response.data;
    if (!data || !data.data || !Array.isArray(data.data.list) || data.data.list.length === 0) {
      console.error('API返回数据为空或格式不正确:', data);
      return [];
    }
    const items = data.data.list.map((item, index) => ({
      platform: 'bilibili',
      title: item.title,
      url: 'https://www.bilibili.com/video/' + item.bvid,
      rank: index + 1,
      hotValue: item.hot || '',
      tid: item.tid || null,
      tname: item.tname || '',
      desc: item.desc || '',
      pic: item.pic || '',
      createdAt: new Date()
    }));
    for (const item of items) {
      await Hotsearch.create(item);
    }
    console.log(`Bilibili热搜爬取并入库成功，共${items.length}条`);
    return items;
  } catch (err) {
    console.error('Bilibili热搜爬取失败：', err);
    return [];
  }
}

// 导出爬虫函数，便于定时任务或手动调用
module.exports = fetchBilibiliHotsearch; 