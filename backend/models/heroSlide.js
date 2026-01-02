const mongoose = require('mongoose');

const HeroSlideSchema = new mongoose.Schema({
    url: { type: String },
    order: { type: Number }
});

module.exports = mongoose.model('HeroSlide', HeroSlideSchema);