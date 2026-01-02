const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
    category: { type: Number },
    name: { type: String }
});

module.exports = mongoose.model('Subcategory', SubCategorySchema);