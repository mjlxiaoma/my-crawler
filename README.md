# 图片爬虫项目

一个基于 Node.js 的专业图片爬虫项目，使用 Puppeteer 实现自动化浏览器操作。

## 项目结构

## 核心模块说明

### BrowserService
浏览器服务，负责管理 Puppeteer 实例和页面操作。

### Downloader
下载管理器，实现并发下载控制和队列管理。

### BaseCrawler
基础爬虫类，提供通用的爬虫功能和错误处理。

### ImageCrawler
图片爬虫实现，包含具体的爬取逻辑和图片提取方法。

## 日志系统

- 错误日志：`logs/error.log`
- 综合日志：`logs/combined.log`
- 控制台输出：实时运行状态

## 注意事项

1. 请遵守目标网站的使用条款和爬虫协议
2. 建议控制爬取频率，避免对目标站点造成压力
3. 确保系统已安装 Chrome 浏览器
4. 下载的图片可能受版权保护，请注意使用规范

## 可扩展功能

- [ ] 添加代理池支持
- [ ] 实现分布式爬虫
- [ ] 添加数据库存储
- [ ] 实现 Web 控制面板
- [ ] 添加更多爬虫类型
- [ ] 实现自动化测试
- [ ] 添加监控告警功能

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

ISC License

## 作者

[你的名字]

## 更新日志

### v1.0.0
- 初始版本发布
- 实现基础爬虫功能
- 添加并发下载支持
- 实现日志系统