// test_puppeteer.js
// 用于测试Puppeteer和Chromium在本机能否正常启动和访问网页
// 运行方法：node test_puppeteer.js

const puppeteer = require('puppeteer');

(async () => {
  try {
    // 启动无头浏览器
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    // 访问百度首页
    await page.goto('https://www.baidu.com', { waitUntil: 'networkidle2', timeout: 30000 });
    // 输出页面标题
    const title = await page.title();
    console.log('页面标题:', title);
    // 关闭浏览器
    await browser.close();
    console.log('Puppeteer 测试通过，浏览器正常启动和关闭。');
  } catch (err) {
    console.error('Puppeteer 测试失败：', err);
  }
})(); 