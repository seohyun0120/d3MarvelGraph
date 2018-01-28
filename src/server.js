var express = require('express');
var app = express();
var server = require('http').createServer(app);
var fs = require('fs');
var port = 8000;

app.use('/lib', express.static(__dirname + "/lib"));

app.get('/', function(request, response) {
  // response.send('Hi There! Does it work?');
  fs.readFile('./Web/index.html', function(error, data){
    response.end(data);
  });
});

app.listen(port, function(err) {
  console.log('Connected port' + port);
  if (err) {
    return console.log('Found error', err);
  }
})
