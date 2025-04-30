// 爬虫索引文件
// 本文件整合了所有平台的热搜爬虫，方便统一调用和管理
// 适合初学者，所有关键步骤均有详细注释

// 导入各平台爬虫
const fetchBilibiliHot = require('./bilibili');
const fetchWeiboHot = require('./weibo');
const fetchZhihuHot = require('./zhihu');
const fetchBaiduHot = require('./baidu');
const fetchDouyinHot = require('./douyin');
const fetchToutiaoHot = require('./toutiao');
const fetchSougouHot = require('./sougou');
const fetchSouhuHot = require('./souhu');
const fetch360searchHot = require('./360search');
const fetchCsdnHot = require('./csdn');
const fetchAcfunHot = require('./acfun');
const fetchCctvHot = require('./cctv');
const fetch360docHot = require('./360doc');

/**
 * 所有平台爬虫的映射表
 * key: 平台标识
 * value: 对应的爬虫函数
 */
const spiders = {
  bilibili: fetchBilibiliHot,
  weibo: fetchWeiboHot,
  zhihu: fetchZhihuHot,
  baidu: fetchBaiduHot,
  douyin: fetchDouyinHot,
  toutiao: fetchToutiaoHot,
  sougou: fetchSougouHot,
  souhu: fetchSouhuHot,
  '360search': fetch360searchHot,
  csdn: fetchCsdnHot,
  acfun: fetchAcfunHot,
  cctv: fetchCctvHot,
  '360doc': fetch360docHot
};

/**
 * 获取所有支持的平台列表
 * @returns {Array<string>} 平台标识数组
 */
function getAllPlatforms() {
  return Object.keys(spiders);
}

/**
 * 执行指定平台的爬虫
 * @param {string} platform 平台标识
 * @returns {Promise<Array>} 返回热搜数组，每个元素为统一格式对象
 */
async function fetchByPlatform(platform) {
  if (!spiders[platform]) {
    console.error(`不支持的平台: ${platform}`);
    return [];
  }
  
  try {
    console.log(`开始抓取${platform}热搜...`);
    const result = await spiders[platform]();
    console.log(`${platform}热搜抓取完成，共${result.length}条`);
    return result;
  } catch (err) {
    console.error(`${platform}热搜抓取异常:`, err);
    return [];
  }
}

/**
 * 执行所有平台的爬虫
 * @returns {Promise<Object>} 返回包含所有平台热搜的对象，key为平台标识，value为热搜数组
 */
async function fetchAllPlatforms() {
  const platforms = getAllPlatforms();
  const result = {};
  
  // 使用Promise.all并行执行所有爬虫
  const promises = platforms.map(async (platform) => {
    try {
      const data = await fetchByPlatform(platform);
      result[platform] = data;
    } catch (err) {
      console.error(`执行${platform}爬虫出错:`, err);
      result[platform] = [];
    }
  });
  
  await Promise.all(promises);
  return result;
}

// 导出函数和映射表
module.exports = {
  spiders,
  getAllPlatforms,
  fetchByPlatform,
  fetchAllPlatforms
}; 