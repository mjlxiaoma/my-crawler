const https = require('https');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class Downloader {
  constructor(config) {
    this.config = config;
    this.queue = [];
    this.running = 0;
  }

  async download(url, filepath) {
    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(fs.createWriteStream(filepath))
            .on('error', reject)
            .once('close', () => resolve(filepath));
        } else {
          response.resume();
          reject(new Error(`Download failed: ${response.statusCode}`));
        }
      }).on('error', reject);
    });
  }

  async addToQueue(task) {
    this.queue.push(task);
    this.processQueue();
  }

  async processQueue() {
    if (this.running >= this.config.maxConcurrent || this.queue.length === 0) {
      return;
    }

    this.running++;
    const task = this.queue.shift();

    try {
      await this.download(task.url, task.filepath);
      logger.info(`Downloaded: ${path.basename(task.filepath)}`);
      await new Promise(resolve => setTimeout(resolve, this.config.delay));
    } catch (error) {
      logger.error(`Download failed for ${task.url}: ${error.message}`);
    } finally {
      this.running--;
      this.processQueue();
    }
  }
}

module.exports = Downloader; 