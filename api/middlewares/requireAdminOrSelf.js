module.exports = (req, res, next) => {
  const { user, params } = req;
  if (user.role === 'ADMIN' || user.id === params.userId) next();
  else return res.status(401).send({ message: 'Unauthorized action' });
};
