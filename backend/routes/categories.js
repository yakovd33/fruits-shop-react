const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const categoriesModel = require('../models/category');

router.get('/', async (req, res, next) => {
    try {
        let categories = await categoriesModel.find();
        res.status(200).json(categories);
    } catch (e) {
        console.log(e);
    }
});

router.post('/', async (req, res, next) => {
    try {
        let response = {};
        const { name } = req.body;

        if (name) {
            let category = new categoriesModel({ name });
            await category.save();
            response = category;
        }

        res.status(200).json(response);
    } catch (e) {
        console.log(e);
    }
});

router.delete('/:id', (req, res, next) => {
    let categoryId = req.params.id;
    
    try {
        categoriesModel.findOneAndDelete({ id: categoryId }).then((re) => {
            console.log(re)
        });
    } catch (e) {
        console.log(e);
    }

    res.send('');
})

module.exports = router;