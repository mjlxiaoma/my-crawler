const winston = require('winston');
const path = require('path');
const config = require('../config/config');

const logger = winston.createLogger({
  level: config.log.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: path.join(config.log.dir, 'error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(config.log.dir, 'combined.log') 
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

module.exports = logger; 