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

router.get('/:category_id', async (req, res, next) => {
    try {
        const category = req.params.category_id;

        let subcategories = await subcategoriesModel.find({ category });
        res.status(200).json(subcategories);
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;