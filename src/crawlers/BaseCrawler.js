const logger = require('../utils/logger');

class BaseCrawler {
  constructor(browserService, downloader) {
    this.browserService = browserService;
    this.downloader = downloader;
  }

  async initialize() {
    await this.browserService.initialize();
  }

  async close() {
    await this.browserService.close();
  }

  async handleError(error, context = '') {
    logger.error(`Crawler error ${context}: ${error.message}`);
    throw error;
  }
}

module.exports = BaseCrawler; 