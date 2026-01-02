const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citySchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
});

module.exports = mongoose.model('City', citySchema);