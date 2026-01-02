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

router.post('/', async (req, res, next) => {
    try {
        let response = {};
        const { name, category } = req.body;

        if (name) {
            let subcategory = new subcategoriesModel({ name, category });
            await subcategory.save();
            response = subcategory;
        }

        res.status(200).json(response);
    } catch (e) {
        console.log(e);
    }
});

router.delete('/:id', (req, res, next) => {
    let subCategoryId = req.params.id;
    
    try {
        subcategoriesModel.findOneAndDelete({ _id: subCategoryId }).then((re) => {
            console.log(re)
        });
    } catch (e) {
        console.log(e);
    }

    res.send('');
});

module.exports = router;