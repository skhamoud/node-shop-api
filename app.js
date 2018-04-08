const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./utils/logger');

// ==== Our modules ======
const headersHandler = require('./api/middlewares/headersHandler');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(headersHandler);
// ===== Routes =========
app.use(`${config.API_ENDPOINT}/products`, productRoutes);
app.use(`${config.API_ENDPOINT}/orders`, orderRoutes);

app.use('/product_images', express.static(path.join(__dirname, 'product_images')));

app.use((req, res, next) => {
  res.status(404).send({ error: { message: 'Not Found' } });
});

// ======= Error handler =======
app.use((err, req, res, next) => {
  logger.error('Unhandlded application error', err);
  res.status(err.status || 500).send(err);
});

module.exports = app;
