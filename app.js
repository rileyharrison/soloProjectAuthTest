var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var passport = require('./strategies/user_sql.js');
var session = require('express-session');

// Route includes
var index = require('./routes/index');
var user = require('./routes/user');
var register = require('./routes/register');
var meal = require('./routes/meal');
var day = require('./routes/day');
var list = require('./routes/list');
var food = require('./routes/food');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Passport Session Configuration //
app.use(session({
   secret: 'secret',
   key: 'user',
   resave: 'true',
   saveUninitialized: false,
   cookie: {maxage: 60000, secure: false}
}));

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/register', register);
app.use('/user', user);
app.use('/', index);
app.use('/meal', meal);
app.use('/day', day);
app.use('/list', list);
app.use('/food', food);
app.use('/index', index);


// Serve back static files
app.use(express.static('public'));
app.use(express.static('public/views'));
app.use(express.static('public/assets'));
app.use(express.static('public/assets/scripts'));
app.use(express.static('public/assets/styles'));
app.use(express.static('public/vendors'));

// Mongo Connection //
// var mongoURI = "mongodb://localhost:27017/user_passport_session";
// //var mongoURI = "";
//
// var mongoDB = mongoose.connect(mongoURI).connection;
//
// mongoDB.on('error', function(err){
//    if(err) console.log("MONGO ERROR: ", err);
// });
//
// mongoDB.once('open', function(){
//    console.log("Connected to Mongo, meow!");
// });

// App Set //
app.set('port', (process.env.PORT || 5000));

// Listen //
app.listen(app.get("port"), function(){
   console.log("Listening on port: " + app.get("port"));
});
