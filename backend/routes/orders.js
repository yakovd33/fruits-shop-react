var express = require('express');
var router = express.Router();
const Order = require('../models/orderModel');

router.post('/', function(req, res, next) {
    try {
        const newOrder = new Order(req.body);
        newOrder.save();
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;