// 抖音热搜爬虫
// 本文件用于抓取抖音热搜榜单，输出统一格式，便于后续存入数据库和前端展示
// 适合初学者，所有关键步骤均有详细注释

const axios = require('axios');

/**
 * 抓取抖音热搜榜单
 * @returns {Promise<Array>} 返回热搜数组，每个元素为统一格式对象
 */
async function fetchDouyinHot() {
  // 抖音热搜接口地址
  const url = 'https://www.douyin.com/aweme/v1/web/hot/search/list/';
  try {
    // 发送GET请求获取热搜数据
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://www.douyin.com/hot',
        'Cookie': '_tea_utm_cache_1243=undefined; passport_assist_user=ClyP08ePpE6KNpX1M-29xuPt89wDlCCcDHdF5buOyNzZQgXBTvIxnLIr10aKOAX5-J3y5HfxnUbfT9A4PqbQCjt7G8OLKE47HCrLtQ4Dqw6wRlUEhYKmH1_JUxKsT8VFAQbRsIIzXPvLG28nsNYHnbELNlW3J4JcMO1KA0S4J0qSRVWjJUKoMM-FBUxeQhHY8Hg83IitrBXefwFrPvk2t0AzMQ==; passport_csrf_token=9ab2f85e4ca32c84ff848d67baaa3bb2; passport_csrf_token_default=9ab2f85e4ca32c84ff848d67baaa3bb2; s_v_web_id=verify_ld09pbpb_WJlDPkSY_iLVq_45L7_9BnI_HGKx4q4kOe7A'
      }
    });
    
    // 获取热搜列表
    const list = res.data.data?.word_list || [];
    const today = new Date().toISOString().slice(0, 10);
    
    // 组装统一格式
    return list.map((item, idx) => ({
      platform: 'douyin',
      title: item.word,
      url: `https://www.douyin.com/search/${encodeURIComponent(item.word)}`,
      hotValue: item.hot_value || null,
      rank: idx + 1,
      desc: item.sentence || '',
      cover: item.word_cover?.url_list?.[0] || '',
      createdAt: today
    }));
  } catch (err) {
    console.error('抖音热搜爬取失败：', err.message);
    // 备注：抖音接口有时需要特定cookie才能访问，可能需要定期更新cookie
    // 如接口无法访问，可考虑使用puppeteer模拟浏览器访问
    console.log('备选方案：可考虑使用puppeteer模拟浏览器访问抖音网页版');
    return [];
  }
}

// 导出爬虫函数
module.exports = fetchDouyinHot; 