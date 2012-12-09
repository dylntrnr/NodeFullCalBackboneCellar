var express = require('express'),
    path = require('path'),
    http = require('http'),
    date = require('./routes/dates');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 5000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/dates', date.findAll);
app.get('/dates/:id', date.findById);
app.post('/dates', date.addDate);
app.put('/dates/:id', date.updateDate);
app.delete('/dates/:id', date.deleteDate);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
