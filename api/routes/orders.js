const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).json({
    msg: 'Fetch orders'
  });
});

router.post('/', (req, res) => {
  const { productId, quantity } = req.body;

  const order = {
    productId,
    quantity
  };

  res.status(201).json({
    msg: 'Create new order',
    order
  });
});

router.get('/:orderId', (req, res) => {
  res.status(200).json({
    msg: `Get order with id ${req.params.orderId}`
  });
});

router.delete('/:orderId', (req, res) => {
  res.status(200).json({
    msg: `Delete order with id ${req.params.orderId}`
  });
});
module.exports = router;
