module.exports = function(req, res, next) {
  res.header('Acces-Controll-Allow-Origin', '*');

  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  // browser http method sent to get an idea of access possibilities
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

    return res.sendStatus(200);
  }

  next();
};
