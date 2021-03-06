var app = require('../index')
var request = require('request')
var should = require('should')
var path = require('path')

// setup

var methods = ['GET', 'POST', 'PUT', 'DELETE']

app
  .use(function(req, res, next){
    req.middleware = true
    next()
  })
  .use('/middle', function(req, res, next){
    res.end('middle')
  })
  .use('/nonMatch', function(req, res, next){
    req.nonMatch = true
    next()
  })

methods.forEach(function(method){
  app[method.toLowerCase()]('/test/:param1/:param2?', function(req, res){
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
      params: req.params,
      query: req.query,
      middleware: req.middleware,
      nonMatch: req.nonMatch,
      body: req.body
    }))
  })
})

app.listen(3000)

// tests

describe("obedient", function () {
  
  methods.forEach(function(method){
  
    describe('app.' + method.toLowerCase() + '()', function(){
      
      if(method === 'POST' || method === 'PUT') {
        it('should return ' + method + ' data', function(done){
          request({url: 'http://localhost:3000/test/exists/exists', method: method, body: 'key=value'}, function(err, res, body){
            should.not.exist(err)
            should.exist(res)
            body.should.equal('{"params":{"param1":"exists","param2":"exists"},"query":{},"middleware":true,"body":{"key":"value"}}')
            res.statusCode.should.equal(200)
            done()
          })      
        })
      }
      
      it('should only return middleware for a particular route', function(done){
        request({url: 'http://localhost:3000/middle/mounted', method: method}, function(err, res, body){
          should.not.exist(err)
          should.exist(res)
          res.statusCode.should.equal(200)
          body.should.equal('middle')
          done()
        })      
      })

      it('should return an error for a route that is too short', function(done){
        request({url: 'http://localhost:3000/test', method: method}, function(err, res, body){
          should.not.exist(err)
          should.exist(res)
          res.statusCode.should.equal(404)
          res.headers['content-type'].should.equal('text/plain')
          body.should.equal('404, Not found')
          done()
        })      
      })
      
      it('should return an error for a route that it too long', function(done){
        request({url: 'http://localhost:3000/test/exists/nonvalid/nonvalid', method: method}, function(err, res, body){
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
          res.statusCode.should.equal(405)
          res.headers['content-type'].should.equal('text/plain')
          body.should.equal('405, Method not allowed')
          done()
        })      
      })
      
      it('should not return an error for a route that exist + middleware set', function(done){
        request({url: 'http://localhost:3000/test/exists/exists', method: method}, function(err, res, body){
          should.not.exist(err)
          should.exist(res)
          res.statusCode.should.equal(200)
          res.headers['content-type'].should.equal('application/json')
          body.should.equal('{"params":{"param1":"exists","param2":"exists"},"query":{},"middleware":true,"body":{}}')
          done()
        })      
      })
      
      it('should return query params in req.query', function(done){
        request({url: 'http://localhost:3000/test/exists/exists?query=true', method: method}, function(err, res, body){
          should.not.exist(err)
          should.exist(res)
          res.statusCode.should.equal(200)
          res.headers['content-type'].should.equal('application/json')
          body.should.equal('{"params":{"param1":"exists","param2":"exists"},"query":{"query":"true"},"middleware":true,"body":{}}')
          done()
        })      
      })
      
    })

  }) 
 
})