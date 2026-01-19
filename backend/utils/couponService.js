const Coupon = require('../models/couponModel');

const normalizeCouponCode = (code = '') => code.trim().toUpperCase();

const toNumberOrUndefined = (value) => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
};

const calculateDiscountAmount = (coupon, cartTotal) => {
    const total = Number(cartTotal) || 0;
    if (total <= 0) {
        return 0;
    }

    let discount = coupon.type === 'percentage'
        ? total * (Number(coupon.value) / 100)
        : Number(coupon.value);

    if (coupon.maxDiscount !== undefined && coupon.maxDiscount !== null) {
        discount = Math.min(discount, Number(coupon.maxDiscount));
    }

    discount = Math.min(discount, total);
    return Math.max(Number.isFinite(discount) ? discount : 0, 0);
};

const buildInvalidResponse = (message) => ({
    valid: false,
    discount: 0,
    coupon: null,
    message
});

const validateCouponForTotal = async (code, cartTotal, { consume = false } = {}) => {
    const normalizedCode = normalizeCouponCode(code);
    if (!normalizedCode) {
        return buildInvalidResponse('קוד קופון חסר');
    }

    const coupon = await Coupon.findOne({ code: normalizedCode });
    if (!coupon) {
        return buildInvalidResponse('הקופון לא נמצא');
    }

    if (!coupon.active) {
        return buildInvalidResponse('הקופון אינו פעיל כעת');
    }

    const now = new Date();
    if (coupon.expiresAt && coupon.expiresAt < now) {
        return buildInvalidResponse('תוקף הקופון פג');
    }

    const total = Number(cartTotal) || 0;
    if (coupon.minOrderTotal && total < coupon.minOrderTotal) {
        return buildInvalidResponse('סכום ההזמנה נמוך מהמינימום לקופון זה');
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return buildInvalidResponse('הקופון הגיע למכסת השימושים שלו');
    }

    const discount = calculateDiscountAmount(coupon, total);
    if (discount <= 0) {
        return buildInvalidResponse('הקופון אינו מקנה הנחה להזמנה זו');
    }

    if (consume) {
        coupon.usageCount += 1;
        await coupon.save();
    }

    return {
        valid: true,
        discount,
        coupon,
        message: 'הקופון הופעל בהצלחה'
    };
};

module.exports = {
    normalizeCouponCode,
    calculateDiscountAmount,
    validateCouponForTotal,
    toNumberOrUndefined
};
