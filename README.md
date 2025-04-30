# 热搜爬虫系统（Node.js 版）

## 项目简介
本项目是一个基于 Node.js 的多平台热搜爬虫系统，支持定时抓取各大平台热搜数据，存储到 MySQL 数据库，并通过统一 API 提供查询和管理功能。适合初学者学习和实际使用。

## 主要功能
- 支持多平台（如Bilibili、微博、知乎等）热搜数据爬取
- 数据自动写入 MySQL 数据库，便于后续分析和查询
- 提供 RESTful API，供前端或其他系统调用
- 支持定时任务自动爬取
- 后台管理系统（可扩展）
- 前端热搜展示页面（可扩展）
- 后端和前端页面通过3007端口进行展示，前后端访问通过不同子目录访问

## 目录结构
```
hotsearch-spider/
├── README.md           # 项目说明文档
├── package.json        # 项目依赖配置
├── .env                # 环境变量（数据库等配置）
├── src/
│   ├── app.js          # 项目入口
│   ├── routes/         # 路由定义
│   ├── controllers/    # 业务逻辑
│   ├── models/         # 数据库模型
│   ├── spiders/        # 各平台爬虫
│   ├── utils/          # 工具函数
│   └── tasks/          # 定时任务
└── public/             # 前端静态资源
```

## 安装与启动方法
1. 安装 Node.js 和 npm
2. 克隆本项目到本地
3. 在项目根目录下运行：
   ```bash
   npm install
   ```
4. 配置 .env 文件，填写数据库等参数，例如：
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=你的密码
   DB_NAME=hotsearch
   ```
5. 启动项目：
   ```bash
   node src/app.js
   ```

## API 说明（后续会详细补充）
- `GET /api/hotsearch?platform=bilibili`  查询指定平台热搜
- `GET /api/hotsearch`  查询所有平台热搜
- 更多接口将持续完善

## 后续开发计划
- [ ] 完善各平台爬虫，统一数据格式
- [ ] 实现后台管理系统（任务、apikey、平台配置等）
- [ ] 开发前端热搜展示页面
- [ ] 增加用户权限和安全认证
- [ ] 丰富 API 查询参数和返回内容

## 启动与访问说明（前后端分离）

### 1. 启动后端 API 服务（端口 3000）

在项目根目录下运行：
```bash
node src/app.js
```
- 后端 API 访问地址示例：
  - http://localhost:3000/api/hotsearch

### 2. 启动前端静态页面服务（端口 3007）

首次使用需安装静态服务器（只需一次）：
```bash
npm install -g serve
```

然后运行：
```bash
serve -l 3007 public
```
- 前端页面访问地址：
  - http://localhost:3007/index.html

### 3. 访问说明
- 前端页面会自动请求 http://localhost:3000/api/hotsearch 获取热搜数据。
- 如遇跨域问题，后端已自动开启 CORS 支持。
- 推荐先启动后端，再启动前端。

### 4. 常见问题
- 如果页面数据加载不出来，请检查后端服务是否已启动，端口是否正确。
- 如需修改端口，请同步修改前端页面中的 API 地址。

## 常见问题
- 如遇到数据库连接问题，请检查 .env 配置和 MySQL 服务状态
- 有任何问题欢迎随时提问！

---

> 本项目适合没有编程基础的用户，所有代码和文档都会有详细中文注释和说明。 