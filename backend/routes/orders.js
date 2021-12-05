var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
const Order = require("../models/orderModel");

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
router.post("/", function (req, res, next) {
	try {
		const newOrder = new Order(req.body);
		newOrder.save();
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
})

module.exports = router;
