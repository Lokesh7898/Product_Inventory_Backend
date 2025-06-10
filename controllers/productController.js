const Product = require('../models/Product');
const mongoose = require('mongoose');


// Get all products
const getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { search, categories } = req.query;

  let query = {};
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  if (categories) {
    const categoryArray = categories.split(',');
    if (categoryArray.length > 0) {
      query.categories = { $in: categoryArray };
    }
  }

  try {
    const products = await Product.find(query)
      .populate('categories', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ addedOn: -1 });

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({ products, currentPage: page, totalPages, totalProducts });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Add product
const addProduct = async (req, res) => {
  const { name, description, quantity, categories } = req.body;

  if (!name || !description || !quantity || !categories || categories.length === 0) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    const productExists = await Product.findOne({ name });
    if (productExists) {
      return res.status(400).json({ message: 'Product with this name already exists' });
    }

    const product = new Product({ name, description, quantity, categories });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  const { name, description, quantity, categories } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = name || product.name;
    product.description = description || product.description;
    product.quantity = quantity !== undefined ? quantity : product.quantity;
    product.categories = categories || product.categories;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};




module.exports = { getProducts, addProduct, updateProduct, deleteProduct };

