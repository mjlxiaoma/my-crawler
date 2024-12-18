const config = require('./config/config');
const BrowserService = require('./services/browserService');
const Downloader = require('./utils/downloader');
const ImageCrawler = require('./crawlers/ImageCrawler');
const logger = require('./utils/logger');
const fs = require('fs');

async function main() {
  try {
    // 确保目录存在
    [config.download.path, config.log.dir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    const browserService = new BrowserService(config.browser);
    const downloader = new Downloader(config.download);
    
    const crawler = new ImageCrawler(browserService, downloader, {
      downloadPath: config.download.path
    });

    await crawler.initialize();
    await crawler.crawl('风景', 20);
    await crawler.close();

  } catch (error) {
    logger.error('Application error:', error);
    process.exit(1);
  }
}

main(); 