let config = {
  PORT: 5000,
  HOSTNAME: 'localhost:5000',
  DB_HOSTNAME: 'mongodb://localhost/rest-shop',
  API_ENDPOINT: '/api/v1',
  SESSION_SECRET: 'secretdelasessionquiesttopsecretetconfidentiel'
};

if (process.env.NODE_ENV === 'production') {
  config = {
    HOSTNAME: process.env.HOSTNAME,
    PORT: process.env.PORT,
    DB_HOSTNAME: process.env.DB_HOSTNAME,
    API_ENDPOINT: process.env.API_ENDPOINT,
    SESSION_SECRET: process.env.SESSION_SECRET
  };
}

module.exports = config;
