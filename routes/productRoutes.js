const Product = require('../models/Product');


const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

router.route('/')
  .get(getProducts)
  .post(addProduct);

router.route('/:id')
  .put(updateProduct);


router.route('/:id').delete(deleteProduct);


module.exports = router;
