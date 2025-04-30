// 搜狗热搜爬虫
// 本文件用于抓取搜狗热搜榜单，输出统一格式，便于后续存入数据库和前端展示
// 适合初学者，所有关键步骤均有详细注释

const axios = require('axios');
const cheerio = require('cheerio'); // 需要安装：npm install cheerio

/**
 * 抓取搜狗热搜榜单
 * @returns {Promise<Array>} 返回热搜数组，每个元素为统一格式对象
 */
async function fetchSougouHot() {
  // 搜狗热搜页面地址
  const url = 'https://top.sogou.com/';
  try {
    // 发送GET请求获取热搜页面
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });
    
    // 使用cheerio加载HTML进行解析
    const $ = cheerio.load(res.data);
    const items = [];
    const today = new Date().toISOString().slice(0, 10);
    
    // 提取热搜列表
    $('.rank-list .rank-item').each((idx, el) => {
      const title = $(el).find('.rank-text').text().trim();
      const url = $(el).find('a').attr('href') || '';
      const hotValue = $(el).find('.hot-value').text().trim();
      
      // 只有标题不为空才添加
      if (title) {
        items.push({
          platform: 'sougou',
          title,
          url,
          hotValue: hotValue ? parseInt(hotValue.replace(/,/g, '')) : null,
          rank: idx + 1,
          desc: '',
          cover: '',
          createdAt: today
        });
      }
    });
    
    return items;
  } catch (err) {
    console.error('搜狗热搜爬取失败：', err.message);
    return [];
  }
}

// 导出爬虫函数
module.exports = fetchSougouHot; 