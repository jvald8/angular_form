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
    users.findByIdOrAdd(profile, function(err, user) {
      if(err) {
        return done(err)
      } else {
        console.log('user from express: ' + user)
        return done(null, user)
      }
    });
  }
));

app.use(express.static('public'));

app.use(bodyParser.json());

app.get('/auth/facebook',
  passport.authenticate('facebook',{ scope : 'email' }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/auth/success', failureRedirect: '/auth/failure' }));

app.get('/auth/success', function(req, res) {
  res.send({ state: 'success', user: req.headers ? req.user : null });
});

app.get('/auth/failure', function(req, res) {
  res.send({ state: 'failure', user: null });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/users', users.findUser);
app.put('/users/:id', users.updateUser);

app.listen(process.env.PORT || 3001, function() {
  console.log('server started on 3001')
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
