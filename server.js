var express = require('express'),
app = express(),
users = require('./users.js'),
bodyParser = require('body-parser'),
passport = require('passport'),
FacebookStrategy = require('passport-facebook').Strategy,
session = require('express-session'),
cookieParser = require('cookie-parser'),
methodOverride = require('method-override');

var FACEBOOK_APP_ID = '921241331269731'
var FACEBOOK_APP_SECRET = '72c5737b25b716c9854cc1157e32639e';

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3001/auth/facebook/callback",
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
    // PASSPORT EXAMPLE
    /*User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return done(err, user);
    });*/

    // ERRORS OUT, response.send(item); AT LINE 57, USERS.JS
    /*users.findByIdOrAdd(profile, function(err, user) {
      if(err) {
        return done('theres been an error');
      } else {
        return done(profile)
      }
    });*/

    // RETURN EMPTY OBJECT
    return done(users.findByIdOrAdd(profile, null))

    // RETURNS PROFILE STRING
    //return done(JSON.stringify(profile))
  }
));

app.use(express.static('public'));

app.use(bodyParser.json());

app.get('/', function(req, res){
  res.send({ user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.send({ user: req.user });
});

app.get('/login', function(req, res){
  res.send({ user: req.user });
});

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: [ 'email' ] }),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/users', users.findUser);
app.post('/users', users.addUser);
app.put('/users/:id', users.updateUser);

app.listen(process.env.PORT || 3001, function() {
  console.log('server started on 3001')
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
