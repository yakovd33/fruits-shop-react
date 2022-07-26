const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String },
    minAmount: { type: Number },
    availability: { type: Boolean },
    category: { type: Number },
    unitType: { type: String },
    price: { type: Number },
    salePrice: { type: Number },
    description: { type: String },
    badge: { type: String, required: false, default: null },
    isHomepage: { type: Boolean, default: false },
    isRecommended: { type: Boolean, default: false },
});

module.exports = mongoose.model('Product', ProductSchema);