'use strict'

const winston = require('winston')

const logger = winston.createLogger({
  // We want info to be the default logging level
  level: (process.env.LOG_LEVEL || 'info'),
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ]
})

module.exports.logger = logger
