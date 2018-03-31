const app = require('express')();
const morgan = require('morgan');
const bodyParser = require('body-parser');

// ==== Our modules ======
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// ==== Middlewares =========
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ===== Routes =========
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// ======= Error handler =======
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message
    }
  });
});

module.exports = app;
