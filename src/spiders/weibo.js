// 微博热搜爬虫
// 本文件用于抓取微博热搜榜单，输出统一格式，便于后续存入数据库和前端展示
// 适合初学者，所有关键步骤均有详细注释

const axios = require('axios');

/**
 * 抓取微博热搜榜单
 * @returns {Promise<Array>} 返回热搜数组，每个元素为统一格式对象
 */
async function fetchWeiboHot() {
  // 微博热搜接口地址
  const url = 'https://weibo.com/ajax/side/hotSearch';
  try {
    // 发送GET请求获取热搜数据
    const res = await axios.get(url, {
      headers: {
        // 微博接口需要User-Agent，否则可能被拒绝
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });
    const list = res.data.data.realtime;
    // 获取当天日期（格式：2024-04-20）
    const today = new Date().toISOString().slice(0, 10);
    // 组装统一格式
    return list.map((item, idx) => ({
      platform: 'weibo', // 平台名
      title: item.word, // 热搜标题
      url: 'https://s.weibo.com/weibo?q=' + encodeURIComponent(item.word), // 热搜详情页
      hotValue: item.num || null, // 热度值，可能为null
      rank: idx + 1, // 排名
      desc: '', // 微博无额外描述
      cover: '', // 微博无封面
      createdAt: today // 入库时间
    }));
  } catch (err) {
    console.error('微博热搜爬取失败：', err.message);
    return [];
  }
}

// 导出爬虫函数
module.exports = fetchWeiboHot; 