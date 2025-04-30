// 今日头条热榜爬虫
// 本文件用于抓取今日头条热榜，输出统一格式，便于后续存入数据库和前端展示
// 适合初学者，所有关键步骤均有详细注释

const axios = require('axios');

/**
 * 抓取今日头条热榜
 * @returns {Promise<Array>} 返回热搜数组，每个元素为统一格式对象
 */
async function fetchToutiaoHot() {
  // 今日头条热榜接口地址
  const url = 'https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc';
  try {
    // 发送GET请求获取热榜数据
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://www.toutiao.com/'
      }
    });
    
    // 获取热榜列表
    const list = res.data.data || [];
    const today = new Date().toISOString().slice(0, 10);
    
    // 组装统一格式
    return list.map((item, idx) => ({
      platform: 'toutiao',
      title: item.Title,
      url: `https://www.toutiao.com/search/?keyword=${encodeURIComponent(item.Title)}`,
      hotValue: item.HotValue || null,
      rank: idx + 1,
      desc: item.Abstract || '',
      cover: item.Image?.url || '',
      createdAt: today
    }));
  } catch (err) {
    console.error('今日头条热榜爬取失败：', err.message);
    return [];
  }
}

// 导出爬虫函数
module.exports = fetchToutiaoHot; 