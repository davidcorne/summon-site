'use strict'
const Airbrake = require('@airbrake/node')

const environment = (process.env.ENVIRONMENT || 'debug')

const notifier = new Airbrake.Notifier({
  projectId: process.env.AIRBRAKE_PROJECT_ID,
  projectKey: process.env.AIRBRAKE_API_KEY,
  environment: environment
})

module.exports.notifier = notifier
