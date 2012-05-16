var http = require('http')
var router = require('routes').Router()
var url = require('url')
var middleware = []

var methods = ['HEAD', 'GET', 'POST', 'PUT', 'DELETE']

var handle = function(req, res) {
  if(middleware.length === 0) return complete(req, res)
  middle(req, res, complete, 1)  
}

var middle = function(req, res, complete, count){
  var next = middleware[middleware.length - count]
  var more = middleware[middleware.length - count - 1]
  count++
  
  var match = ( ! next['path'] || req.url.indexOf(next['path']) === 0)
  
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

  if( ! match) return sendError(res, route)

  req.params = match.params
  req.query = parts.query

  var tmp = res.writeHead
  res.writeHead = function(){
    this.emit('header')
    return tmp.apply(this, arguments)
  }

  match.fn(req, res)
}

var sendError = function(res, route) {
  var code = checkRoutes(route) ? 405 : 404
  var error = (code === 405) ? 'Method not allowed' : 'Not found'

  res.statusCode = code
  res.setHeader("Content-Type", "text/plain")
  res.end(code + ', ' + error)  
}

var checkRoutes = function(route) {
  return methods.some(function(method){
    return router.match('/' + method.toUpperCase() + route)
  })
}

methods.forEach(function(method){
  module.exports[method.toLowerCase()] = function(route, cb) {
    router.addRoute('/' + method + route, cb)  
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
}

module.exports.listen = function(port){
  http.createServer(handle).listen(port)
}