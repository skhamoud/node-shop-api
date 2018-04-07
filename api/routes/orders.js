const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { API_ENDPOINT } = require('../../config');

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({ path: 'product', select: 'name' })
      .select('-__v')
      .exec();
    res.status(200).json({
      orders: orders.map(order => {
        const { product, _id } = order;
        return {
          product,
          _id,
          request: { method: 'GET', url: `${API_ENDPOINT}/orders/${order.id}` }
        };
      }),
      count: orders.length
    });
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.post('/', async (req, res) => {
  const { productId, quantity } = req.body;
  const order = new Order({
    product: productId,
    quantity
  });

  try {
    // validate to avoid waiting for save to validate, case where querying with invalid id
    // causes Not found response which wouldn't be accurate
    order.validate(err => {
      if (err) return res.status(500).send({ error: err });
    });
    const orderedProduct = await Product.findById(productId);
    if (orderedProduct) {
      const savedOrder = await order.save();
      res.status(201).json({
        savedOrder
      });
    } else res.status(404).send({ error: { message: "Product ordered doesn't exist!" } });
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('product')
      .select('-__v');
    if (!order) res.status(404).send({ error: { message: 'Order not Found' } });
    else
      res.status(200).send({
        order
      });
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.delete('/:orderId', async (req, res) => {
  try {
    const order = await Order.findByIdAndRemove(req.params.orderId);
    if (order) res.status(200).send({ message: 'Succesfully deleted the Order' });
    else
      res.status(404).send({
        message: 'Order Not Found!'
      });
  } catch (error) {
    res.status(500).send({ error });
  }
});
module.exports = router;
