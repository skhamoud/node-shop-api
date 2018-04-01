const http = require('http');
const app = require('./app');

const PORT = require('./config').PORT;

const server = http.createServer(app);

server.listen(PORT, function() {
  console.log(`listening on ${PORT}`);
});
