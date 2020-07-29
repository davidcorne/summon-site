'use strict'
const decode = require('urldecode')
const express = require('express')
const fs = require('fs')
const path = require('path')
const pug = require('pug')

const config = require('./configuration')
const log = require('./log').logger
const monsters = require('./data/summonable_monsters')
const spellData = require('./spellData')
require('./error_notification')

let SERVICE_WORKER_DATA = null

process.on('message', function (message) {
  log.debug(JSON.stringify(message, null, 4))
  if (message.tag === 'service_worker_data') {
    SERVICE_WORKER_DATA = message.data
  } else {
    log.error('Unknown message: ' + JSON.stringify(message))
  }
})

const APP = express()
APP.set('port', config.port)

const HTTP = require('http').Server(APP)

const TEMPLATES = {
  index: pug.compileFile('template/index.pug'),
  404: pug.compileFile('template/404.pug')
}

const onRequest = function (request) {
  log.debug(
    'Request: ' + request.path + ' ' + JSON.stringify(request.query)
  )
}

const sendTemplate = function (request, response, key, data) {
  response.send(TEMPLATES[key](data))
}

const handle404 = function (request, response, reason) {
  onRequest(request)
  response.status(404)
  sendTemplate(request, response, '404', { reason: reason, path: request.path })
}

const start = function () {
  HTTP.listen(APP.get('port'), function () {
    log.info('Listening on *:' + APP.get('port'))
  })
}

APP.get('/', function (request, response) {
  onRequest(request)
  const data = {
    monsters: monsters,
    spellData: spellData.spellData
  }
  sendTemplate(
    request, response,
    'index',
    data
  )
})
const servePath = function (filePath, request, response) {
  fs.stat(filePath, function (error, stats) {
    if (error) {
      handle404(request, response, 'Resource not found')
    } else {
      response.sendFile(filePath)
    }
  })
}

APP.get('/public/*', function (request, response) {
  onRequest(request)
  const filePath = path.join(__dirname, decode(request.path))
  servePath(filePath, request, response)
})

APP.get('/service-worker.js', function (request, response) {
  // A service worker needs to be served from root to cache all of the files.
  onRequest(request)
  if (config.environment === 'debug') {
    // Don't serve up a service worker in debug
    handle404(request, response, 'Don\'t want a service worker in debug')
  } else {
    // Read the service worker, but put the project md5 into it and the list
    // of public resources for it to cache.
    fs.readFile('public/resources/service-worker.js', function (error, buffer) {
      if (error) {
        throw error
      }
      response.type('js')
      response.send(`const md5 = '${SERVICE_WORKER_DATA.md5}'
        PRECACHE_URLS=${JSON.stringify(SERVICE_WORKER_DATA.publicFileList)}
        ${buffer}
      `)
    })
  }
})

// Note: This should always be the last route, as otherwise it'll override the other routes.
APP.get('*', function (request, response) {
  handle404(request, response, 'Unknown Page')
})

module.exports.start = start

// Allow you to run the worker as a single process if you don't need the cluster.
if (require.main === module) {
  start()
}
