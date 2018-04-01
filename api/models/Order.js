const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  productId: String,
  quantity: Number
});

module.exports = mongoose.model('Order', orderSchema);
