// 手动测试Bilibili热搜爬虫脚本
// 运行方法：node test_bilibili_spider.js

// 1. 加载.env配置和数据库连接
require('dotenv').config();
require('./src/app'); // 确保数据库已初始化

// 2. 引入Bilibili爬虫函数
const fetchBilibiliHotsearch = require('./src/spiders/bilibili');

// 3. 调用爬虫函数，抓取并写入数据库
(async () => {
  console.log('开始抓取Bilibili热搜...');
  const result = await fetchBilibiliHotsearch();
  console.log('抓取结果：');
  console.log(result);
  console.log('测试完成，请通过API或数据库查看数据是否写入成功。');
  process.exit(0);
})(); 