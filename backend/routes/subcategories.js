const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const subcategoriesModel = require('../models/subcategory');

router.get('/', async (req, res, next) => {
    try {
        let subcategories = await subcategoriesModel.find();
        res.status(200).json(subcategories);
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;