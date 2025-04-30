// 搜狐热搜爬虫
// 本文件用于抓取搜狐热点，输出统一格式，便于后续存入数据库和前端展示
// 适合初学者，所有关键步骤均有详细注释

const axios = require('axios');

/**
 * 抓取搜狐热点
 * @returns {Promise<Array>} 返回热搜数组，每个元素为统一格式对象
 */
async function fetchSouhuHot() {
  // 搜狐热点接口地址
  const url = 'https://v2.sohu.com/integration-api/mix/region/84';
  try {
    // 发送GET请求获取热点数据
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://www.sohu.com/'
      }
    });
    
    // 获取热点列表
    const list = res.data?.data?.items || [];
    const today = new Date().toISOString().slice(0, 10);
    
    // 组装统一格式
    return list.map((item, idx) => {
      // 从资源数据中提取标题、链接和封面
      const resourceData = item.resourceData || {};
      return {
        platform: 'souhu',
        title: resourceData.title || resourceData.mobileTitle || '',
        url: resourceData.url || resourceData.pcUrl || '',
        hotValue: resourceData.readCount || null,
        rank: idx + 1,
        desc: resourceData.summary || resourceData.abstractSummary || '',
        cover: resourceData.picUrl || resourceData.mobilePicUrl || resourceData.authorPic || '',
        createdAt: today
      };
    }).filter(item => item.title); // 过滤掉没有标题的项
  } catch (err) {
    console.error('搜狐热点爬取失败：', err.message);
    return [];
  }
}

// 导出爬虫函数
module.exports = fetchSouhuHot; 