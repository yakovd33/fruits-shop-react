const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    product: { type: Number, required: true },
    amount: { type: Number, required: true },
    discount: { type: Number, required: true },
});

module.exports = mongoose.model('Discount', discountSchema);