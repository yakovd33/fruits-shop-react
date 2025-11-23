const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    apartment: { type: String, required: true },
    notes: { type: String },
    cart: { type: String },
    price: { type: String },
    date: { type: Number, default: Date.now() },
    payed: { type: Boolean, default: false },
    gift: { type: String, default: null, required: false },
    couponCode: { type: String, default: null },
    couponDiscount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Order', orderSchema);