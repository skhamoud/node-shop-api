const router = require('express').Router();
const Product = require('../models/Product');
const { API_ENDPOINT } = require('../../config');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .select({ __v: 0 })
      .exec();
    res.status(200).json({
      count: products.length,
      products: products.map(product => {
        return {
          product,
          request: { method: 'GET', url: `${API_ENDPOINT}/products/${product.id}` }
        };
      })
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post('/', async (req, res) => {
  const { name, price } = req.body;
  const product = new Product({
    name,
    price
  });
  try {
    const productInDb = await Product.findOne({ name: name }).exec();
    if (productInDb) {
      return res.status(406).json({
        error: {
          message: 'Product name already exists'
        }
      });
    }
    const savedProduct = await product.save();
    res.status(201).json({
      savedProduct,
      request: { method: 'GET', url: `${API_ENDPOINT}/products/${savedProduct.id}` }
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get('/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId).select({ __v: 0 });
    if (product) res.status(200).json({ product });
    else res.status(404).json({ error: { message: 'No Entry for that Id' } });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.patch('/:productId', async (req, res) => {
  const { params: { productId }, body: data } = req;
  const updateOps = {};
  Object.keys(data).forEach(prop => {
    updateOps[prop] = data[prop];
  });
  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, { $set: updateOps });
    if (updatedProduct) {
      res.status(200).json({
        updatedProduct,
        request: { method: 'GET', url: `${API_ENDPOINT}/products/${savedProduct.id}` }
      });
    } else res.status(404).json({ error: { message: 'No Entry for that Id' } });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.delete('/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const removedProduct = await Product.findByIdAndRemove(productId);
    if (removedProduct) res.sendStatus(200);
    else res.status(404).json({ error: { message: 'No Entry for that Id' } });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
