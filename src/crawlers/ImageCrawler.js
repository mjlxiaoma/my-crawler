const BaseCrawler = require('./BaseCrawler');
const logger = require('../utils/logger');
const path = require('path');

class ImageCrawler extends BaseCrawler {
  constructor(browserService, downloader, options = {}) {
    super(browserService, downloader);
    this.options = options;
  }

  async crawl(searchWord, maxImages = 20) {
    try {
      const page = await this.browserService.newPage();
      logger.info(`Starting image crawl for: ${searchWord}`);

      await page.goto(
        `https://image.baidu.com/search/index?tn=baiduimage&word=${encodeURIComponent(searchWord)}`,
        { waitUntil: 'networkidle0', timeout: 60000 }
      );

      const images = await this.extractImages(page, maxImages);
      await this.downloadImages(images);

      logger.info(`Crawl completed for: ${searchWord}`);
    } catch (error) {
      this.handleError(error, 'crawl');
    }
  }

  async extractImages(page, maxImages) {
    await page.waitForSelector('.main_img', { timeout: 10000 });
    
    return page.evaluate((max) => {
      const imgElements = document.querySelectorAll('.main_img');
      return Array.from(imgElements)
        .slice(0, max)
        .map(img => ({
          src: img.src,
          title: img.alt || '未命名'
        }));
    }, maxImages);
  }

  async downloadImages(images) {
    for (const image of images) {
      if (image.src?.startsWith('http')) {
        const filename = `${Date.now()}_${image.title.replace(/[\/\\:*?"<>|]/g, '')}.jpg`;
        const filepath = path.join(this.options.downloadPath, filename);
        await this.downloader.addToQueue({ url: image.src, filepath });
      }
    }
  }
}

module.exports = ImageCrawler; 