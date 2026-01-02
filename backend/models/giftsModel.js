const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const giftsModel = new Schema({
    productId: { type: String, required: true }
});

module.exports = mongoose.model('Gift', giftsModel);