const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String },
    minAmount: { type: Number },
    availability: { type: Boolean },
    category: { type: Number },
    unitType: { type: String },
    price: { type: Number },
    priceKg: { type: Number },
    salePrice: { type: Number },
    salePriceKg: { type: Number },
    description: { type: String },
    badge: { type: String, required: false, default: null },
    isHomepage: { type: Boolean, default: false },
    isRecommended: { type: Boolean, default: false },
    subCategory: { type: String }
});

module.exports = mongoose.model('Product', ProductSchema);