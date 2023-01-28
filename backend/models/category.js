const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const CategorySchema = new mongoose.Schema({
    id: { type: Number },
    name: {
        type: String,
        unique: true
    }
});

CategorySchema.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = mongoose.model('Category', CategorySchema);