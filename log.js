'use strict'

const winston = require('winston')

const config = require('./configuration')

const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ]
})

module.exports.logger = logger
