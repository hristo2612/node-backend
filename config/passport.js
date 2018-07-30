var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]'
}, function(email, password, done){
    User.findOne({email: email}).then(function(user) {
        if (!user || !user.validPassword(password)) {
            return done(null, false, {errors: {'email or password': 'is invalid'}})
        }

        return done(null, user);
    }).catch(done);
}))

passport.use(new FacebookStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://3a9338fd.ngrok.io/api/users/login/facebook/return"
  },
  function(accessToken, refreshToken, profile, done) {
      User.findOrCreate({facebookId: profile.id}, {username: (Math.random() * Math.pow(36, 6) | 0).toString(36), email: (Math.random() * Math.pow(36, 6) | 0).toString(36) + '@c.c'}).then(function(userDoc){
        return done(null, userDoc.doc);
      }).catch(done);
  }
));
