const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).json({
    msg: 'Get request to /products'
  });
});

router.post('/', (req, res) => {
  const { name, price } = req.body;

  const product = {
    name,
    price
  };

  res.status(201).json({
    msg: 'Created new Product',
    product
  });
});

router.get('/:productId', (req, res) => {
  res.status(200).json({
    msg: `Get request to /products/${req.params.productId}`,
    id: req.params.productId
  });
});

router.patch('/:productId', (req, res) => {
  res.status(200).json({
    msg: `Update product with id ${req.params.productId}`
  });
});

router.delete('/:productId', (req, res) => {
  res.status(200).json({
    msg: `Delete product with id ${req.params.productId}`
  });
});

module.exports = router;
