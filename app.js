const app = require("express")();

app.use((req, res, next) => {
  res.status(200).json({
    msg: "It works"
  });
});

module.exports = app;
