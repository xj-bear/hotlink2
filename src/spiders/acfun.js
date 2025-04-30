// AcFun热榜爬虫
// 本文件用于抓取AcFun热榜，输出统一格式，便于后续存入数据库和前端展示
// 适合初学者，所有关键步骤均有详细注释

const axios = require('axios');

/**
 * 抓取AcFun热榜
 * @returns {Promise<Array>} 返回热搜数组，每个元素为统一格式对象
 */
async function fetchAcfunHot() {
  // AcFun热榜接口地址
  const url = 'https://www.acfun.cn/rest/pc-direct/rank/channel?channelId=0&rankPeriod=DAY&pageSize=30&pageNo=1';
  try {
    // 发送GET请求获取热榜数据
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://www.acfun.cn/rank/list'
      }
    });
    
    // 获取热榜列表
    const list = res.data?.rankList || [];
    const today = new Date().toISOString().slice(0, 10);
    
    // 组装统一格式
    return list.map((item, idx) => ({
      platform: 'acfun',
      title: item.contentTitle || '',
      url: `https://www.acfun.cn${item.contentUrl || ''}`,
      hotValue: item.viewCount || null,
      rank: idx + 1,
      desc: item.contentDesc || '',
      cover: item.coverUrl || '',
      createdAt: today
    })).filter(item => item.title); // 过滤掉没有标题的项
  } catch (err) {
    console.error('AcFun热榜爬取失败：', err.message);
    return [];
  }
}

// 导出爬虫函数
module.exports = fetchAcfunHot; 