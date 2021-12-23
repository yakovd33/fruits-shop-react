var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
const Order = require("../models/orderModel");
const Product = require('../models/productModel');
const axios = require('axios').default;
var FormData = require('form-data');

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

	result.orders = await Order.find()
		.sort("date")
		.limit(20)
		.skip(20 * (page - 1));
	res.status(200).json(result);
});

// Add new order
router.post("/", async function (req, res, next) {
	try {
		// Get product prices from DB
		let cart = JSON.parse(req.body.cart);
		let final_price = 0;

		for (var i = 0; i < cart.length; i++) {
			let productId = cart[i].id;
			
			let product = await Product.findOne({ _id: productId });

			if (product) {
				let price = product.salePrice ? product.salePrice : product.price;
				final_price += price;
				// console.log('price: ' + product.price);
			}
		}
		
		const newOrder = new Order(req.body);
		await newOrder.save();

		const params = new URLSearchParams();
		params.append('pageCode', process.env.PAGE_CODE_CREDIT);
		params.append('userId', process.env.MESHULAM_USERID);
		params.append('sum', final_price);
		params.append('successUrl', 'https://pryerek.co.il/thanks?order=true');
		params.append('cancelUrl', 'https://pryerek.co.il');
		params.append('description', 'הזמנה מאתר פרי וירק ארצנו');
		params.append('pageField[fullName]', req.body.fullname);
		params.append('pageField[phone]', req.body.phone);
		params.append('pageField[email]', req.body.email);
		params.append('cField1', newOrder._id);
		
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
	let paymentSum = req.body.sum;
	let transactionId = req.body.transactionId;
	let transactionToken = req.body.transactionToken;

	try {
		// Approve transaction with Meshulam API
		const data = new FormData(req.body);
		data.append('pageCode', process.env.PAGE_CODE_CREDIT);

		let response = await axios.post(`https://secure.meshulam.co.il/api/light/server/1.0/approveTransaction/`, data);

		Order.findOneAndUpdate({ _id: order_id }, {
			$set: { 
				'payed': true
		 	}
		}, (err, docs) => {
			console.log(err)
		});
	} catch (e) {
		console.log(e)
	}

	console.log('payyyy');
	// axios.get('http://eropa.co.il/log.php?log=' + JSON.stringify(req));
	res.send('lalala');
});

module.exports = router;