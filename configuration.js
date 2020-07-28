'use strict'

const fs = require('fs')
const os = require('os')

const config = {
  environment: (process.env.ENVIRONMENT || 'debug'),
  airbrakeProjectId: process.env.AIRBRAKE_PROJECT_ID,
  airbrakeProjectKey: process.env.AIRBRAKE_API_KEY,
  logLevel: (process.env.LOG_LEVEL || 'info'),
  workers: (process.env.NUMBER_OF_WORKERS || os.cpus().length),
  port: (process.env.PORT || 3000)
}

// Override those properties with the user config
if (fs.existsSync('user_config.json')) {
  const userConfig = require('./user_config')
  for (const property in userConfig) {
    config[property] = userConfig[property]
  }
}

module.exports = config
