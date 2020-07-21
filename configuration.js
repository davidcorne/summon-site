'use strict'

const config = {
  environment: (process.env.ENVIRONMENT || 'debug'),
  airbrakeProjectId: process.env.AIRBRAKE_PROJECT_ID,
  airbrakeProjectKey: process.env.AIRBRAKE_API_KEY
}

// Override those properties with the user config
const userConfig = require('./user_config')
for (const property in userConfig) {
  config[property] = userConfig[property]
}

module.exports = config
