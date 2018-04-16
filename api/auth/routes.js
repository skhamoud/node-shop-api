const router = require('express').Router();
const passport = require('passport');
const User = require('../models/User');

router.post('/login', passport.authenticate('local'), (req, res) => {
  if (req.isAuthenticated()) {
    const { _id, username } = req.user;
    res.status(200).send({ status: 'authenticated', user: { _id, username } });
  } else res.status(403).send({ status: 'unauthenticated' });
});

// Register route
router.post('/register', async (req, res) => {
  const { name, username, phone, password } = req.body;
  try {
    const existingUser = await User.findOne({ username: req.body.username }).exec();
    if (existingUser) return res.status(409).send({ message: 'Username taken!' });
    else {
      const hashedPassword = await User.hashPassword(password);
      const user = new User({
        username,
        password: hashedPassword,
        name,
        phone
      });

      const newUser = await user.save();
      user.password = undefined;
      if (newUser) {
        res.status(201).send({ message: 'user registered succesfully!', user });
        req.logIn(newUser, function(err) {
          if (err)
            return res.status('500').send({
              message: `couldn't log user automatically,
           visit /auth/login to login manually!`
            });
        });
      }
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
});

module.exports = router;
