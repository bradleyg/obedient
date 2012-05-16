var app = require('../index.js')

app.use(function(req, res, next){
  console.log("middleware for all routes")
  next()
})

app.use('/route', function(req, res, next){
  console.log("middleware for particular route")
  next()
})

app.get('/test/:param?', function(req, res){
  res.end(JSON.stringify(req.params))
})

app.post('/test/:param?', function(req, res){
  res.end(JSON.stringify(req.params))
})

app.put('/test/:param?', function(req, res){
  res.end(JSON.stringify(req.params))
})

app.delete('/test/:param?', function(req, res){
  res.end(JSON.stringify(req.params))
})

app.listen(3000)