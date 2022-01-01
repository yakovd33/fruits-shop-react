const express = require('express');
const router = express.Router();
const discountModel = require('../models/discountModel');

router.get('/', async (req, res, next) => {
    try {
        let discounts = await discountModel.find();
        res.status(200).json(discounts);
    } catch (e) {
        console.log(e);
    }
});

router.post('/', async (req, res, next) => {
    let product_id = req.body.product;
    let amount = req.body.amount;
    let discount = req.body.discount;

    let newDiscount = new discountModel(req.body);
    newDiscount.save();
});

module.exports = router;