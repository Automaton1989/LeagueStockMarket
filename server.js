var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var session = require('express-session');
var bcrypt = require("bcrypt");
var chartjs = require("chart.js");
var app = express();
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {},
}))
require('./server/config/mongoose.js')
require('./server/models/user.js')
mongoose.model('Order');
mongoose.model('Team');
mongoose.model('User');
mongoose.Promise = global.Promise;
var path = require('path')
app.use(express.static(path.join(__dirname, '/public/dist/public')));
require('./server/config/routes.js')(app);
app.listen(8000, function() {
    console.log('listening on port 8000')
})