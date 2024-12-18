module.exports = {
  browser: {
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ],
    ignoreDefaultArgs: ['--enable-automation']
  },
  download: {
    path: './downloads',
    maxConcurrent: 3,
    delay: 500
  },
  log: {
    level: 'info',
    dir: './logs'
  }
}; 