const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['fixed', 'percentage'], default: 'fixed' },
    value: { type: Number, required: true, min: 0 },
    minOrderTotal: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    usageLimit: { type: Number },
    usageCount: { type: Number, default: 0 },
    description: { type: String, trim: true },
    expiresAt: { type: Date },
    active: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);
