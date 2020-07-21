'use strict'
const Airbrake = require('@airbrake/node')

const config = require('./configuration')

const notifier = new Airbrake.Notifier(config)

module.exports.notifier = notifier
