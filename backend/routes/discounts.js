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
            discountsWithNames.push({ _id: discount._id, product_name: product.name, amount: discount.amount, discount: discount.discount })
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

router.get('/product_discount/:product_id/:amount', async (req, res, next) => {
    let product_id = req.params.product_id;
    let amount = req.params.amount;
    let discount = 0;

    // Find discount
    try {
        let discounts = await discountModel.find({ product: product_id }).sort({ amount: 'descending' });

        if (discounts.length == 1) {
            // Only one discount for product
            if (amount >= discounts[0].amount) {
                discount = discounts[0].discount;
            }
        } else if (discounts.length) {
            // More than one discount for product
            for (var i = 0; i < discounts.length; i++) {
                if (amount >= discounts[i].amount) {
                    discount = discounts[i].discount;
                    break;
                }
            }
        }
    } catch (e) {
        console.log(e);
    }

    res.status(200).send(discount.toString())
})

module.exports = router;