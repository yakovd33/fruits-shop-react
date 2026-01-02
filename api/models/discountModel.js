const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discountSchema = new mongoose.Schema({
    product: { type: Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    discount: { type: Number, required: true },
});

module.exports = mongoose.model('Discount', discountSchema);