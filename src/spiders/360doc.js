// 360doc热榜爬虫
// 本文件用于抓取360doc热门文章，输出统一格式，便于后续存入数据库和前端展示
// 适合初学者，所有关键步骤均有详细注释

const axios = require('axios');
const cheerio = require('cheerio'); // 需要安装：npm install cheerio

/**
 * 抓取360doc热门文章
 * @returns {Promise<Array>} 返回热搜数组，每个元素为统一格式对象
 */
async function fetch360docHot() {
  // 360doc热门文章页面地址
  const url = 'http://www.360doc.com/index.html';
  try {
    // 发送GET请求获取页面
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });
    
    // 使用cheerio加载HTML进行解析
    const $ = cheerio.load(res.data);
    const items = [];
    const today = new Date().toISOString().slice(0, 10);
    
    // 提取热门文章列表
    $('.article_list li').each((idx, el) => {
      if (idx >= 30) return; // 只取前30条
      
      const title = $(el).find('.article_title').text().trim();
      const url = $(el).find('.article_title a').attr('href') || '';
      const desc = $(el).find('.article_summary').text().trim();
      const coverEl = $(el).find('.article_img img');
      const cover = coverEl.attr('src') || coverEl.attr('_src') || '';
      
      // 只有标题不为空才添加
      if (title) {
        items.push({
          platform: '360doc',
          title,
          url,
          hotValue: null, // 360doc没有热度值
          rank: idx + 1,
          desc,
          cover,
          createdAt: today
        });
      }
    });
    
    return items;
  } catch (err) {
    console.error('360doc热门文章爬取失败：', err.message);
    return [];
  }
}

// 导出爬虫函数
module.exports = fetch360docHot; 