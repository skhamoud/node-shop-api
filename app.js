const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const helmet = require('helmet');
const mongoose = require('mongoose');

// our modules
const config = require('./config');
const logger = require('./utils/logger');
const passport = require('./api/auth/passport');
// our middlewares
const headersHandler = require('./api/middlewares/headersHandler');
const authRoutes = require('./api/auth/routes');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

// ======== DB connection =============
mongoose.connect(config.DB_HOSTNAME, {});
const db = mongoose.connection;
db.once('open', () => {
  logger.info('connected to db...');
});
db.on('error', () => {
  throw new Error('DB connection failed');
});
db.on('disconnected', () => {
  throw new Error('DB disconnected... ');
});

// ==== Middlewares =========
const app = express();
app.use(morgan('tiny', { stream: logger.stream }));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cookieSession({
    name: 'lasession',
    keys: [config.SESSION_SECRET],
    // Cookie Options
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(headersHandler);
// ===== Routes =========
app.use('/auth', authRoutes);
app.use(`${config.API_ENDPOINT}/products`, productRoutes);
app.use(`${config.API_ENDPOINT}/orders`, orderRoutes);
app.use(`${config.API_ENDPOINT}/users`, userRoutes);
app.use('/product_images', express.static(path.join(__dirname, 'product_images')));

app.use((req, res) => {
  res.status(404).send({ error: { message: 'Not Found' } });
});

// ======= Error handler =======
app.use((err, req, res, next) => {
  logger.error('Unhandlded application error', err);
  res.status(err.status || 500).send(err);
});

module.exports = app;
