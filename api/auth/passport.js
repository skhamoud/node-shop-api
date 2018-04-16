const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/User');

// serialize user id into session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
// deserialize user id from session
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  new localStrategy(async (username, password, done) => {
    try {
      // get user from db
      const user = await User.findOne({ username }).exec();
      if (!user) return done(null, false, { message: 'Invalid Credentials' });
      const isPasswordValid = await user.isPasswordValid(password);
      if (!isPasswordValid) return done(null, false, { message: 'Invalid Credentials' });
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  })
);

module.exports = passport;
