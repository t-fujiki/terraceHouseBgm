
/**
 * Module dependencies.
 */

var express = require('express')
  , video = require('./routes/video')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
    res.sendfile(path.join(__dirname, 'public') + '/index.html');
});

app.get('/google6545b9b2dd775c84.html', function(req, res) {
    res.sendfile(path.join(__dirname, 'public') + '/google6545b9b2dd775c84.html');
});


var mongoose = require('mongoose');
var uri = process.env.MONGOHQ_URL || 'mongodb://localhost/terrace';
mongoose.connect(uri); 

app.get('/api/video/list', video.list);
app.get('/api/video/date', video.date);
app.post('/api/video/:id', video.update);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
