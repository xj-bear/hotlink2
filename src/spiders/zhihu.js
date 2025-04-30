// 知乎热搜爬虫
// 本文件用于抓取知乎热榜，输出统一格式，便于后续存入数据库和前端展示
// 适合初学者，所有关键步骤均有详细注释

const axios = require('axios');

/**
 * 抓取知乎热榜
 * @returns {Promise<Array>} 返回热搜数组，每个元素为统一格式对象
 */
async function fetchZhihuHot() {
  // 知乎热榜接口地址
  const url = 'https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50&desktop=true';
  try {
    // 发送GET请求获取热榜数据
    const res = await axios.get(url, {
      headers: {
        // 知乎接口建议加User-Agent，防止被拦截
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });
    const list = res.data.data;
    // 获取当天日期（格式：2024-04-20）
    const today = new Date().toISOString().slice(0, 10);
    // 组装统一格式
    return list.map((item, idx) => ({
      platform: 'zhihu', // 平台名
      title: item.target.title, // 热搜标题
      url: item.target.url.replace('api.zhihu.com/questions', 'www.zhihu.com/question'), // 转换为网页可访问的链接
      hotValue: null, // 知乎无热度值
      rank: idx + 1, // 排名
      desc: '', // 暂无描述
      cover: '', // 暂无封面
      createdAt: today // 入库时间
    }));
  } catch (err) {
    console.error('知乎热搜爬取失败：', err.message);
    return [];
  }
}

// 导出爬虫函数
module.exports = fetchZhihuHot; 