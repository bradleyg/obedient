var http = require('http')
var router = require('routes').Router()
var url = require('url')
var middleware = []

var methods = {
  'head': 'HEAD',
  'get': 'GET', 
  'post': 'POST', 
  'put': 'PUT', 
  'del': 'DELETE'
}

var middle = function(req, res, complete, count){
  var next = middleware[middleware.length - count]
  var more = middleware[middleware.length - count - 1]
  count++

  next(req, res, function(){
    if( ! more) return complete(req, res)
    middle(req, res, complete, count)
  })
}

var complete = function(req, res) {
  var parts = url.parse(req.url, true)
  var match = router.match('/' + req.method.toUpperCase() + parts.pathname)

  if( ! match) {
    res.statusCode = 404
    res.setHeader("Content-Type", "text/plain");
    return res.end('404, Not found')
  }
  req.params = match.params
  req.query = parts.query

  var tmp = res.writeHead
  res.writeHead = function(){
    this.emit('header')
    return tmp.apply(this, arguments)
  }

  match.fn(req, res)
}

var handle = function(req, res) {
  if(middleware.length === 0) return complete(req, res)
  middle(req, res, complete, 1)  
}

Object.keys(methods).forEach(function(method){
  module.exports[method] = function(route, cb) {
    router.addRoute('/' + methods[method] + route, cb)  
  }
})

module.exports.use = function(middle) {
  if(typeof middle !== 'function') {
    throw new Error('Supplied middle ware is not a function')
  }
  middleware.unshift(middle)
}

module.exports.listen = function(port){
  http.createServer(handle).listen(port)
}