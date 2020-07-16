'use strict'
const express = require('express')
const pug = require('pug')

const log = require('./log').logger

const APP = express()
APP.set('port', (process.env.PORT || 3000))

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
  sendTemplate(request, response, 'index', {})
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
