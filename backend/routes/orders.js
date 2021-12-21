var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
const Order = require("../models/orderModel");
const axios = require('axios').default;

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
		const newOrder = new Order(req.body);
		await newOrder.save();

		const params = new URLSearchParams();
		params.append('pageCode', 'adad7d131ec4');
		params.append('userId', '1364e144d2bda404');
		params.append('sum', '100');
		params.append('successUrl', 'https://pryerek.co.il/thanks?order=true');
		params.append('cancelUrl', 'https://pryerek.co.il');
		params.append('description', 'הזמנה מאתר פרי וירק ארצנו');
		params.append('pageField[fullName]', req.body.fullname);
		params.append('pageField[phone]', req.body.phone);
		params.append('pageField[email]', 'yakovd33@gmail.com');
		params.append('cField1', newOrder._id);
		
		let result = await axios.post('https://sandbox.meshulam.co.il/api/light/server/1.0/createPaymentProcess', params);

		res.status(200).json(result.data);
	} catch (e) {
		console.log(e);
	}
});

// Delete an order
router.delete('/:id', (req, res, next) => {
	let order_id = req.params.id;

	console.log(order_id)

	try {
		Order.findOneAndDelete({ _id: new mongoose.Types.ObjectId(order_id) }).then((re) => {
			console.log(re)
		}).error((err) => console.log(err));
	} catch (e) {
		console.log(e);
	}

	res.send('success')
});

router.post('/pay/:id', (req, res, next) => {
	let order_id = req.params.id;

	try {
		Order.findOneAndUpdate({ _id: order_id }, {
			$set: { 
				'payed': true
		 	}
		}, (err, docs) => {
			console.log(err)
		})
	} catch (e) {
		console.log(e)
	}

	res.status(200).send('');
})

module.exports = router;
