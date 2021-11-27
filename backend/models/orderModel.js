const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    apartment: { type: String, required: true },
    notes: { type: String },
    cart: { type: String },
    price: { type: String },
    date: { type: Number, default: Date.now() }
});

module.exports = mongoose.model('Order', orderSchema);