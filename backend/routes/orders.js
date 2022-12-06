var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
const Order = require("../models/orderModel");
const Product = require('../models/productModel');
const axios = require('axios').default;
var FormData = require('form-data');
const discountModel = require('../models/discountModel');
const citiesModel = require('../models/cityModel');

// Get all orders
router.get("/", async (req, res, next) => {
	let page = req.query.page;

	let result = {};

	if (!page) {
		page = 1;
	}

	await Order.find().then((res) => {
		result.total = res.length;
	});

	let tmpOrders = [];
	let ordersWithCities = [];

	tmpOrders = await Order.find()
		.sort("date")
		.limit(20)
		.skip(20 * (page - 1));

	for (let i = 0; i < tmpOrders.length; i++) {
		let city = await citiesModel.findOne({ _id: tmpOrders[i].city });
		tmpOrders[i].city = city?.name || "deleted city";
		ordersWithCities.push(tmpOrders[i]);
	}
	
	result.orders = ordersWithCities;

	res.status(200).json(result);
});

// Get product discount
const getProductDiscount = async (product_id, amount) => {
    try {
        let discounts = await discountModel.find({ product: product_id }).sort({ amount: 'descending' });

        if (discounts.length == 1) {
            // Only one discount for product
            if (amount >= discounts[0].amount) {
                return discounts[0].discount;
            }
        } else if (discounts.length) {
            // More than one discount for product
            for (var i = 0; i < discounts.length; i++) {
                if (amount >= discounts[i].amount) {
                    return discounts[i].discount;
                }
            }
        }
    } catch (e) {
        console.log(e);
    }

	return 0;
}

// Add new order
router.post("/", async function (req, res, next) {
	try {
		// Get product prices from DB
		let cart = JSON.parse(req.body.cart);
		let final_price = 0;

		for (var i = 0; i < cart.length; i++) {
			let productId = cart[i].id;
			let amount = cart[i].amount;
			
			let product = await Product.findOne({ _id: productId });

			if (product) {
				let price = product.salePrice ? product.salePrice : product.price;

				// Get discounts
				let discount = await getProductDiscount(productId, amount);

				
				final_price += price * amount - discount;
			}
		}

		req.body.price = final_price;

		if (final_price < 250) {
			req.body.gift = null;

			// Get shipping price
			let city = await citiesModel.findOne({ _id: req.body.city });
			let shipping_price = city.price;
			final_price += shipping_price;
		}
		
		const newOrder = new Order(req.body);
		await newOrder.save();

		const params = new URLSearchParams();

		let method = req.body.method || 'credit';

		var pageCode = process.env.PAGE_CODE_CREDIT;
		if (method == 'bit') {
			pageCode = process.env.PAGE_CODE_BIT;
		}
		
		params.append('pageCode', pageCode);
		params.append('userId', process.env.MESHULAM_USERID);
		params.append('sum', final_price);
		params.append('successUrl', 'https://pryerek.co.il/thanks?order=true');
		params.append('cancelUrl', 'https://pryerek.co.il');
		params.append('description', 'הזמנה מאתר פרי וירק ארצנו');
		params.append('pageField[fullName]', req.body.fullname);
		params.append('pageField[phone]', req.body.phone);
		params.append('pageField[email]', req.body.email);
		params.append('cField1', newOrder._id);
		params.append('cField2', pageCode);
		
		let result = await axios.post('https://secure.meshulam.co.il/api/light/server/1.0/createPaymentProcess', params);
		res.status(200).json(result.data);
	} catch (e) {
		console.log(e);
	}
});

// Delete an order
router.delete('/:id', (req, res, next) => {
	let order_id = req.params.id;

	console.log(order_id);

	try {
		Order.findOneAndDelete({ _id: new mongoose.Types.ObjectId(order_id) }).then((re) => {
			console.log(re)
		}).error((err) => console.log(err));
	} catch (e) {
		console.log(e);
	}

	res.send('success')
});

router.post('/pay', async (req, res, next) => {
	let order_id = req.body.data.customFields.cField1;
	let pageCode = req.body.data.customFields.cField2;
	let paymentSum = req.body.sum;
	let transactionId = req.body.transactionId;
	let transactionToken = req.body.transactionToken;

	try {
		// Approve transaction with Meshulam API
		const data = new FormData(req.body);
		data.append('pageCode', pageCode);

		let response = await axios.post(`https://secure.meshulam.co.il/api/light/server/1.0/approveTransaction/`, data);
		console.log(response.data);
		// axios.get('http://eropa.co.il/log.php?log=' + JSON.stringify(req));
		axios.get('http://eropa.co.il/log.php?log=' + encodeURIComponent(JSON.stringify(response?.data)));
		axios.get('http://eropa.co.il/log.php?log=' + encodeURIComponent(JSON.stringify(req.body)));

		// if (response.data.status == 1) {
			console.log('approved');
			Order.findOneAndUpdate({ _id: order_id }, {
				$set: {
					'payed': true
				}
			}, (err, docs) => {
				console.log(err)
			});
		// } else {
		// 	console.log('not approved');
		// }
	} catch (e) {
		console.log(e)
	}

	console.log('payyyy');
	res.send('lalala');
});

router.get('/product_discount', async (req, res, next) => {
	let { productId, amount } = req.query;

	try {
		const discount = await getProductDiscount(productId, amount);
		res.send(discount.toString() || '0')
	} catch (e) {
		console.log(e);
		res.send('0')
	}
})

module.exports = router;