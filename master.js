'use strict'
const cluster = require('cluster')
const fs = require('fs')
const md5 = require('md5')

const config = require('./configuration')
const log = require('./log').logger
require('./error_notification')

const SERVICE_WORKER_DATA = {
  md5: '',
  publicFileList: ['/',
    'public/resources/index.css',
    'public/resources/index.js',
    'public/resources/sorttable.js',
    'public/images/FreeAction.png',
    'public/images/OneAction.png',
    'public/images/Reaction.png',
    'public/images/ThreeActions.png',
    'public/images/TwoActions.png']
}

cluster.on('online', function (worker) {
  worker.process.send('load-search-index')
  worker.send({
    tag: 'service_worker_data',
    data: SERVICE_WORKER_DATA
  })
})

const newWorker = function () {
  cluster.fork()
}

const startWorkers = function () {
  const currentWorkers = Object.keys(cluster.workers).length
  // currentWorkers should always be 0, but it's worth checking.
  const workersToSetup = config.workers - currentWorkers
  log.info('Master cluster setting up ' + workersToSetup + ' workers')
  for (let i = 0; i < workersToSetup; i++) {
    newWorker()
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
    newWorker()
  })
}

const setupServiceWorker = function () {
  // If there are *any* files which changing could change the user behaviour,
  // they should be added here.
  const privateFileList = [
    'configuration.js',
    'data/summonable_monsters.json',
    'error_notification.js',
    'log.js',
    'master.js',
    'package.json',
    'public/images/FreeAction.png',
    'public/images/OneAction.png',
    'public/images/Reaction.png',
    'public/images/ThreeActions.png',
    'public/images/TwoActions.png',
    'public/resources/index.css',
    'public/resources/index.js',
    'public/resources/service-worker.js',
    'public/resources/sorttable.js',
    'scrape.js',
    'server.js',
    'spellData.js',
    'template/404.pug',
    'template/index.pug',
    'template/layout.pug',
    'template/sidebar.pug',
    'test_data/Monsters.html',
    'utest.js',
    'worker.js'
  ]
  const md5Array = []
  for (const file of privateFileList) {
    const content = fs.readFileSync(file)
    md5Array.push(md5(content))
  }
  SERVICE_WORKER_DATA.md5 = md5(md5Array.join(''))
  console.log(JSON.stringify(SERVICE_WORKER_DATA, null, 4))
}

const start = function () {
  log.info(JSON.stringify(config, null, 4))
  setupServiceWorker()
  setupCallbacks()
  startWorkers()
}

module.exports.start = start
