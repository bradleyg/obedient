var http = require('http')
var router = require('routes').Router()
var middleware = []

var methods = {
  'head': 'HEAD',
  'get': 'GET', 
  'post': 'POST', 
  'put': 'PUT', 
  'del': 'DELETE'
}

var handle = function(req, res) {
  var match = router.match('/' + req.method + req.url)
  if( ! match) {
    res.statusCode = 404
    res.setHeader("Content-Type", "text/plain");
    return res.end('404, Not found')
  }
  req.params = match.params
  if(middleware.length === 0) return match.fn(req, res)
  middle(req, res, match.fn, 1)
}

var middle = function(req, res, done, count){
  middleware[middleware.length - count](req, res, function(){
    count++
    var cb = middleware[middleware.length - count] ? middle : done
    cb(req, res, done, count)
  })
}

module.exports.use = function(middle) {
  if(typeof middle !== 'function') throw new Error('Supplied middle ware is not a function')
  middleware.unshift(middle)
}

module.exports.listen = function(port){
  http.createServer(handle).listen(port)
}

Object.keys(methods).forEach(function(method){
  module.exports[method] = function(route, cb) {
    router.addRoute('/' + methods[method] + route, cb)  
  }
})