const Category = require('../models/Category');

const mongoose = require('mongoose');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort('name');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createMultipleCategories = async (req, res) => {
  const categoriesToCreate = req.body;

  if (!Array.isArray(categoriesToCreate) || categoriesToCreate.length === 0) {
    return res.status(400).json({ message: 'Request body must be a non-empty array of categories' });
  }

  try {

    const createdCategories = await Category.insertMany(categoriesToCreate, { ordered: false }); // ordered: false से अगर कोई एक डुप्लीकेट हो तो बाकी बन जाएंगी

    res.status(201).json({ message: 'Categories created successfully', data: createdCategories });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Some categories already exist. Duplicate names are not allowed.' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory: createMultipleCategories,
};