const http = require('http');
const app = require('./app');
const logger = require('./utils/logger');

const PORT = require('./config').PORT;

const server = http.createServer(app);

server.listen(PORT, function() {
  logger.info(`listening on ${PORT}`);
});

process.on('uncaughtException', err => logger.error('uncaught exception', err));
process.on('unhandledRejection', err => logger.error('unhandled rejection', err));
