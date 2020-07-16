'use strict'
const cluster = require('cluster')
const os = require('os')

const log = require('./log').logger

const NUMBER_OF_WORKERS = (process.env.WORKERS || os.cpus().length)

const startWorkers = function () {
  const currentWorkers = Object.keys(cluster.workers).length
  // currentWorkers should always be 0, but it's worth checking.
  const workersToSetup = NUMBER_OF_WORKERS - currentWorkers
  log.info('Master cluster setting up ' + workersToSetup + ' workers')
  for (let i = 0; i < workersToSetup; i++) {
    cluster.fork()
  }
}

const setupCallbacks = function () {
  cluster.on('online', function (worker) {
    log.info('Worker ' + worker.process.pid + ' is online.')
  })
  cluster.on('exit', function (worker, code, signal) {
    // You only get one of code and signal, only display one.
    log.info(
      'Worker ' +
                worker.process.pid +
                ' died (' +
                (code || signal) +
                ')'
    )
    log.info('Starting a new worker.')
    cluster.fork()
  })
}

const start = function () {
  log.info('Logging level: ' + log.level)
  setupCallbacks()
  startWorkers()
}

module.exports.start = start
