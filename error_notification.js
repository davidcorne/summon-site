'use strict'
const Airbrake = require('@airbrake/node')

const config = require('./configuration')

const notifier = new Airbrake.Notifier({
  environment: config.environment,
  projectId: config.airbrakeProjectId,
  projectKey: config.airbrakeProjectKey
})

module.exports.notifier = notifier
