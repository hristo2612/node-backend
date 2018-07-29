var fs = require('fs'),
    http = require('http'),
    path = require('path'),
    methods = require('methods'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cors = require('cors'),
    passport = require('passport'),
    errorhandler = require('errorhandler'),
    mongoose = require('mongoose'),
    MongoStore = require('connect-mongo')(session);

var isProduction = process.env.NODE_ENV === 'production';

// Global Express app object
var app = express();

app.use(cors());

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

if (process.env.NODE_ENV === 'production') {
    mongoose.connect(process.env.MONGODB_URI + '/node-backend');
} else {
    mongoose.connect('mongodb://localhost/nodebackend');
    mongoose.set('debug', true);
}

app.use(session({ store: new MongoStore({ mongooseConnection: mongoose.connection }), secret: 'backend', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

require('./models/User');
require('./models/Article');
require('./models/Comment');
require('./config/passport');

app.use(require('./routes'));

// Catch 404 and forward error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handlers

// Development Error Handler
// prints stack trace
if (!isProduction) {
    app.use(function(err, req, res, next){
        console.log(err.stack);
        
        res.status(err.status || 500);

        res.json({'errors': {
            message: err.message,
            error: err
        }});
    });
}

// Production Error Handler
// no stack trace
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({'errors': {
        message: err.message,
        error: {}
    }});
});

// Spin up the server
var server = app.listen(process.env.PORT || 3000, function() {
    console.log('Started listening on port ' + server.address().port);
})
