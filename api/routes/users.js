const router = require('express').Router();
const User = require('../models/User');
const requireLoggedIn = require('../middlewares/requireLoggedIn');
const requireAdminOrSelf = require('../middlewares/requireAdminOrSelf');
// get all users
router.get('/', requireLoggedIn, (req, res) => {
  User.find()
    .select('-password')
    .exec()
    .then(users => {
      res.status(200).send({ users, count: users.length });
    })
    .catch();
});
// get a specific user with id
router.get('/:userId', requireLoggedIn, async (req, res) => {
  try {
    const existingUser = await User.findById(req.params.userId)
      .select('-password')
      .exec();
    if (existingUser) return res.status(200).send(existingUser);
    else res.status(400).send({ message: 'user not found' });
  } catch (error) {
    res.status(500).send(error);
  }
});

// update user with id
router.patch('/:userId', requireLoggedIn, requireAdminOrSelf, async (req, res) => {
  const updateOps = {};
  Object.keys(req.body).forEach(property => (updateOps[property] = req.body[property]));
  try {
    const existingUser = await User.findByIdAndUpdate(req.params.userId, { $set: updateOps })
      // .select('-password')
      .exec();
    if (existingUser)
      return res.status(200).send({ message: "updated user's fields succesfully", existingUser });
    else res.status(400).send({ message: 'user not found' });
  } catch (error) {
    res.status(500).send({ message: 'update failed', error });
  }
});

router.delete('/:userId', requireLoggedIn, requireAdminOrSelf, async (req, res) => {
  try {
    const deleted = await User.findByIdAndRemove(req.params.userId)
      .select('-password')
      .exec();
    if (deleted) return res.status(200).send({ message: 'deleted succesfully!', deleted });
    else res.status(400).send({ message: 'user not found' });
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
