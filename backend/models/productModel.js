const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String },
    minAmount: { type: Number },
    availability: { type: Boolean },
    category: { type: Number },
    unitType: { type: String },
    price: { type: Number }
});

module.exports = mongoose.model('Product', ProductSchema);