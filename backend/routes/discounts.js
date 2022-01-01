const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const discountModel = require('../models/discountModel');
const productModel = require('../models/productModel');

router.get('/', async (req, res, next) => {
    try {
        let discounts = await discountModel.find();
        let discountsWithNames = [];

        for (var i = 0; i < discounts.length; i++) {
            let discount = discounts[i];
            let product_id = discount.product;

            
            let product = await productModel.findOne({ _id: product_id });
            discountsWithNames.push({ product_name: product.name, amount: discount.amount, discount: discount.discount })
        }

        res.status(200).json(discountsWithNames);
    } catch (e) {
        console.log(e);
    }
});

router.post('/', async (req, res, next) => {
    try {
        let newDiscount = new discountModel(req.body);
        newDiscount.save();
    } catch (e) {
        console.log(e)
    }
});

router.delete('/:discount_id', async (req, res, next) => {
    let discount_id = req.params.discount_id;

    try {
		discountModel.findOneAndDelete({ _id: new mongoose.Types.ObjectId(discount_id) }).then((re) => {
			console.log(re)
		}).error((err) => console.log(err));
	} catch (e) {
		console.log(e);
	}
    
    res.send('');
});

module.exports = router;