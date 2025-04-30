// 360搜索热榜爬虫
// 本文件用于抓取360搜索热榜，输出统一格式，便于后续存入数据库和前端展示
// 适合初学者，所有关键步骤均有详细注释

const axios = require('axios');
const cheerio = require('cheerio'); // 需要安装：npm install cheerio

/**
 * 抓取360搜索热榜
 * @returns {Promise<Array>} 返回热搜数组，每个元素为统一格式对象
 */
async function fetch360SearchHot() {
  // 360搜索热榜页面地址
  const url = 'https://trends.so.com/hot/realtime';
  try {
    // 发送GET请求获取热榜页面
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://www.so.com/'
      }
    });
    
    // 使用cheerio加载HTML进行解析
    const $ = cheerio.load(res.data);
    const items = [];
    const today = new Date().toISOString().slice(0, 10);
    
    // 提取热搜列表
    $('.trend-list .trend-item').each((idx, el) => {
      const title = $(el).find('.title').text().trim();
      const url = $(el).find('a').attr('href') || '';
      const hotValue = $(el).find('.hot-value').text().trim();
      const desc = $(el).find('.desc').text().trim() || '';
      
      // 只有标题不为空才添加
      if (title) {
        items.push({
          platform: '360search',
          title,
          url,
          hotValue: hotValue ? parseInt(hotValue.replace(/万/g, '0000').replace(/,/g, '')) : null,
          rank: idx + 1,
          desc,
          cover: '',
          createdAt: today
        });
      }
    });
    
    return items;
  } catch (err) {
    console.error('360搜索热榜爬取失败：', err.message);
    return [];
  }
}

// 导出爬虫函数
module.exports = fetch360SearchHot; 