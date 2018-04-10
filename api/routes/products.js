const router = require('express').Router();
const Product = require('../models/Product');
const { API_ENDPOINT } = require('../../config');
const productUploadHandler = require('../middlewares/productUploadHandler');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .select({ __v: 0 })
      .exec();
    res.status(200).send({
      count: products.length,
      products: products.map(product => {
        return {
          product,
          request: { method: 'GET', url: `${API_ENDPOINT}/products/${product.id}` }
        };
      })
    });
  } catch (error) {
    res.status(500).send({ error });
  }
});

// const requireNewProductName = async (req, res, next) => {
//   try {
//     const existingProductName = await Product.findOne({ name: req.body.name }).exec();
//     if (!existingProductName) return next();
//     res.status(406).send({
//       error: {
//         message: 'Product name already exists'
//       }
//     });
//   } catch (error) {
//     res.status(500).send({ error });
//   }
// };

router.post('/', productUploadHandler, async (req, res) => {
  const { name, price } = req.body;
  // both props are arrays in req.files passed from the handler
  const { productImage: [productImage], images } = req.files;
  const product = new Product({
    name,
    price,
    productImage: productImage.path,
    images: images.map(img => img.path)
  });
  try {
    const savedProduct = await product.save();
    res.status(201).send({
      savedProduct,
      request: { method: 'GET', url: `${API_ENDPOINT}/products/${savedProduct.id}` }
    });
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.get('/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId)
      .select({ __v: 0 })
      .exec();
    if (product) res.status(200).send({ product });
    else res.status(404).send({ error: { message: 'No Entry for that Id' } });
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.patch('/:productId', async (req, res) => {
  const { params: { productId }, body: data } = req;
  const updateOps = {};
  Object.keys(data).forEach(prop => {
    updateOps[prop] = data[prop];
  });
  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, { $set: updateOps }).exec();
    if (updatedProduct) {
      res.status(200).send({
        updatedProduct,
        request: { method: 'GET', url: `${API_ENDPOINT}/products/${updatedProduct.id}` }
      });
    } else res.status(404).send({ error: { message: 'No Entry for that Id' } });
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.delete('/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const removedProduct = await Product.findByIdAndRemove(productId).exec();
    if (removedProduct) res.sendStatus(204);
    else res.status(404).send({ error: { message: 'No Entry for that Id' } });
  } catch (error) {
    res.status(500).send({ error });
  }
});

module.exports = router;
