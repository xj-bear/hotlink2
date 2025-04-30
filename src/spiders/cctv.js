// CCTV热榜爬虫
// 本文件用于抓取央视新闻热榜，输出统一格式，便于后续存入数据库和前端展示
// 适合初学者，所有关键步骤均有详细注释

const axios = require('axios');
const cheerio = require('cheerio'); // 需要安装：npm install cheerio

/**
 * 抓取央视新闻热榜
 * @returns {Promise<Array>} 返回热搜数组，每个元素为统一格式对象
 */
async function fetchCctvHot() {
  // 央视网热点页面地址
  const url = 'https://news.cctv.com/2019/07/gaiban/cmsdatainterface/page/news_1.jsonp';
  try {
    // 发送GET请求获取热搜数据
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://news.cctv.com/'
      }
    });
    
    // 处理JSONP响应，提取JSON部分
    const jsonStr = res.data.match(/^news\((.*)\)$/)?.[1] || '{}';
    const data = JSON.parse(jsonStr);
    
    // 获取热点列表
    const list = data.data?.list || [];
    const today = new Date().toISOString().slice(0, 10);
    
    // 组装统一格式
    return list.map((item, idx) => ({
      platform: 'cctv',
      title: item.title || '',
      url: item.url || '',
      hotValue: null, // 央视新闻没有热度值
      rank: idx + 1,
      desc: item.brief || '',
      cover: item.image || '',
      createdAt: today
    })).filter(item => item.title); // 过滤掉没有标题的项
  } catch (err) {
    console.error('央视新闻热榜爬取失败：', err.message);
    return [];
  }
}

// 导出爬虫函数
module.exports = fetchCctvHot; 