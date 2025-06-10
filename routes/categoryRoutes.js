const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const { getCategories, createMultipleCategories } = require('../controllers/categoryController');

router.get('/',  getCategories);
router.post('/bulk', createMultipleCategories);


module.exports = router;
