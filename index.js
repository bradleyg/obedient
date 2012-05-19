var http = require('http')
var qs = require('querystring')
var url = require('url')
var router = require('routes').Router()
var middleware = []

var methods = ['HEAD', 'GET', 'POST', 'PUT', 'DELETE']

var errors = {
  400: 'Bad request',
  404: 'Not found',
  405: 'Method not allowed'
}

var handle = function(req, res) {
  if(middleware.length === 0) return complete(req, res)
  middle(req, res, complete, 1)
}

var middle = function(req, res, complete, count){
  var next = middleware[middleware.length - count]
  var more = middleware[middleware.length - count - 1]
  count++
  
  var mount = (req.url.indexOf(next['path']) === 0)
  var match = ( ! next['path'] || mount)
  
  if(mount) req.url = req.url.replace(next['path'], '')
  
  var checkMore = function() {
    if(more) middle(req, res, complete, count)
    else complete(req, res)
  }
  
  if(match) next['fn'](req, res, checkMore) 
  else checkMore()
}

var complete = function(req, res) {
  var parts = url.parse(req.url, true)
  var route = parts.pathname
  var match = router.match('/' + req.method.toUpperCase() + route)

  if( ! match) {
    var code = checkRoutes(route) ? 405 : 404
    return sendError(res, code)
  }
  
  parseBody(req, res, function(err){
    if(err) return sendError(res, 400)
  
    req.params = match.params
    req.query = parts.query
  
    var tmp = res.writeHead
    res.writeHead = function(){
      this.emit('header')
      return tmp.apply(this, arguments)
    }
  
    match.fn(req, res)
  })
}

var sendError = function(res, code) {
  res.statusCode = code
  res.setHeader("Content-Type", "text/plain")
  res.end(code + ', ' + errors[code])  
}

var parseBody = function(req, res, cb) {
  var body = ''
  
  req.on('data', function(chunk) {
    body += chunk
  })

  req.on('end', function() {
    req.body = qs.parse(body)
    cb(null)
  })

  req.on('error', function(err){
    cb(err)
  })
}

var checkRoutes = function(route) {
  return methods.some(function(method){
    return router.match('/' + method.toUpperCase() + route)
  })
}

methods.forEach(function(method){
  module.exports[method.toLowerCase()] = function(route, cb) {
    router.addRoute('/' + method + route, cb)
    return this
  }
})

module.exports.use = function(path, fn) {
  if(typeof path === 'function') {
    fn = path
    path = null
  }
  else if(typeof path !== 'string' || typeof fn !== 'function') {
    throw new Error('supplied path+middleware is not a string+function')
  }
  middleware.unshift({path: path, fn: fn})
  return this
}

module.exports.listen = function(port){
  http.createServer(handle).listen(port)
  return this
}