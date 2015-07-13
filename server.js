var express = require('express'),
ids = require('./ids.js'),
app = express(),
users = require('./users.js'),
bodyParser = require('body-parser'),
passport = require('passport'),
FacebookStrategy = require('passport-facebook').Strategy,
session = require('express-session'),
cookieParser = require('cookie-parser'),
methodOverride = require('method-override');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(passport.initialize());

passport.use(new FacebookStrategy({
    clientID: ids.FACEBOOK_APP_ID,
    clientSecret: ids.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3001/auth/facebook/callback",
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
    return users.findByIdOrAdd(profile, done);
  }
));

app.use(express.static('public'));

app.use(bodyParser.json());

app.get('/', function(req, res){
  res.send({ user: req.user });
});

app.get('/account', function(req, res){
  console.log(req)
  res.send({ user: req.user});
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
