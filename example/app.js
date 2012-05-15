var app = require('../index.js')

app.use(function(req, res, next){
  console.log("middleware")
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