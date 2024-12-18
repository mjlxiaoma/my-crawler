const puppeteer = require('puppeteer');
const logger = require('../utils/logger');

class BrowserService {
  constructor(config) {
    this.config = config;
    this.browser = null;
  }

  async initialize() {
    try {
      this.browser = await puppeteer.launch(this.config);
      logger.info('Browser initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize browser:', error);
      throw error;
    }
  }

  async newPage() {
    if (!this.browser) {
      await this.initialize();
    }
    const page = await this.browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    return page;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

module.exports = BrowserService; 