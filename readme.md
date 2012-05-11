###Obedient - Minimal http framework with nothing.   
Install: ```npm install obedient```
***
###app.get():  
```javascript
app.get(route, callback)
```
Connect style routing for __GET__ http methods. Missing routes will throw a 404.  
###app.post():  
```javascript
app.post(route, callback)
```
Connect style routing for __POST__ http methods. Missing routes will throw a 404.  
###app.put():  
```javascript
app.put(route, callback)
```
Connect style routing for __PUT__ http methods. Missing routes will throw a 404.  
###app.del():  
```javascript
app.del(route, callback)
```
Connect style routing for __DELETE__ http methods. Missing routes will throw a 404.  
###app.listen():  
```javascript
app.listen(port)
```
Port for server to listen on.
###app.use():  
```javascript
app.use(middleware)
```
Connect style middleware.  
###Deps:
Router documentation: [https://github.com/aaronblohowiak/routes.js](https://github.com/aaronblohowiak/routes.js)  
***
###Examples: 
[View the examples](https://github.com/bradleyg/obedient/blob/master/example/app.js)  
***
###Tests  
```
npm test
```  

[![Build Status](https://secure.travis-ci.org/bradleyg/obedient.png)](http://travis-ci.org/bradleyg/obedient)