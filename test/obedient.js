var app = require('../index')
var request = require('request')
var should = require('should')
var path = require('path')

// methods

app.use(function(req, res, next){
  req.params.middleware = true
  next()
})

app.get('/test/:param1/:param2?', function(req, res){
  res.setHeader("Content-Type", "application/json");
  res.emit('header')
  res.end(JSON.stringify(req.params))
})

app.post('/test/:param1/:param2?', function(req, res){
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(req.params))
})

app.put('/test/:param1/:param2?', function(req, res){
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(req.params))
})

app.del('/test/:param1/:param2?', function(req, res){
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(req.params))
})

app.listen(3000)

// tests

var methods = {
  'get': 'GET', 
  'post': 'POST', 
  'put': 'PUT', 
  'del': 'DELETE'
}

describe("obedient", function () {
  
  Object.keys(methods).forEach(function(method){
  
    describe('app.' + method + '()', function(){
      
      it('should return an error for a route that is too short', function(done){
        request({url: 'http://localhost:3000/test', method: methods[method]}, function(err, res, body){
          should.not.exist(err)
          should.exist(res)
          res.statusCode.should.equal(404)
          res.headers['content-type'].should.equal('text/plain')
          body.should.equal('404, Not found')
          done()
        })      
      })
      
      it('should return an error for a route that it too long', function(done){
        request({url: 'http://localhost:3000/test/exists/nonvalid/nonvalid', method: methods[method]}, function(err, res, body){
          should.not.exist(err)
          should.exist(res)
          res.statusCode.should.equal(404)
          res.headers['content-type'].should.equal('text/plain')
          body.should.equal('404, Not found')
          done()
        })      
      })
      
      it('should return an error if the method is not correct', function(done){
        request({url: 'http://localhost:3000/test/exists', method: 'TRACE'}, function(err, res, body){
          should.not.exist(err)
          should.exist(res)
          res.statusCode.should.equal(404)
          res.headers['content-type'].should.equal('text/plain')
          body.should.equal('404, Not found')
          done()
        })      
      })
      
      it('should not return an error for a route that exist + middleware set', function(done){
        request({url: 'http://localhost:3000/test/exists/exists', method: methods[method]}, function(err, res, body){
          should.not.exist(err)
          should.exist(res)
          res.statusCode.should.equal(200)
          res.headers['content-type'].should.equal('application/json')
          body.should.equal('{"param1":"exists","param2":"exists","middleware":true}')
          done()
        })      
      })
      
    })

  }) 
 
})