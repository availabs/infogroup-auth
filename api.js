//Module dependencies

const express = require('express')
var cors = require('cors')
var path = require('path');
var uuid = require('uuid/v4');
var session = require('express-session');
const FileStore = require('session-file-store')(session);
var passport = require('passport');
var bodyParser = require('body-parser');
var LocalStrategy = require('passport-local').Strategy;


let routes = require('./routes');

const users = [
    {id: '2f24vvg', email: 'test', password: 'test'},
    {id: '2f24vvh', email: 'admin', password: 'admin'}
]

// configure passport.js to use the local strategy
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
        console.log('Inside local strategy callback');
        // here is where you make a call to the database
        // to find the user based on their username or email address
        // for now, we'll just pretend we found that it was users[0]
        const user = users[0]
        if(email === user.email && password === user.password) {
            console.log('Local strategy returned true')
            return done(null, user)
            // make a call to our api
        }
    }
));

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
    console.log('Inside serializeUser callback. User id is save to the session file store here')
    done(null, user.id);
});

// deserializer
passport.deserializeUser((id, done) => {
    console.log('Inside deserializeUser callback')
    console.log(`The user id passport saved in the session file store is: ${id}`)
    const user = users[0].id === id ? users[0] : false;
    done(null, user);
});
//Create server
const app = express();

app.use(cors())
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public')));

//------
// add & configure middleware
// router.use(bodyParser.urlencoded({ extended: false }))
// router.use(bodyParser.json())
app.use(session({
    genid: (req) => {
        console.log('Inside the session middleware');
        console.log(req.sessionID)
        console.log(`Request object sessionID from client: ${req.sessionID}`)
        return uuid() // use UUIDs for session IDs
    },
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);


//app.use(express.static(__dirname + '/public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


module.exports = app;