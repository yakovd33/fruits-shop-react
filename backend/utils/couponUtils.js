const normalizeCouponCode = (code) => {
    if (!code) {
        return '';
    }

    return code.toString().trim().toUpperCase();
};

const buildInvalidResponse = (message) => ({
    valid: false,
    discount: 0,
    message: message || 'קופון לא תקף'
});

const validateCouponForTotal = (coupon, cartTotalRaw) => {
    if (!coupon) {
        return buildInvalidResponse('קופון לא נמצא');
    }

    if (!coupon.active) {
        return buildInvalidResponse('קופון אינו פעיל');
    }

    if (coupon.value <= 0) {
        return buildInvalidResponse('ערך קופון לא תקין');
    }

    const cartTotal = Number(cartTotalRaw) || 0;

    if (cartTotal <= 0) {
        return buildInvalidResponse('סכום עגלה לא תקין');
    }

    const now = new Date();

    if (coupon.expiresAt && coupon.expiresAt < now) {
        return buildInvalidResponse('קופון פג תוקף');
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return buildInvalidResponse('קופון הגיע למכסת השימושים');
    }

    if (coupon.minOrderTotal && cartTotal < coupon.minOrderTotal) {
        return buildInvalidResponse(`יש להזמין מעל ${coupon.minOrderTotal}₪ כדי להשתמש בקופון`);
    }

    let discount = 0;

    if (coupon.type === 'percentage') {
        discount = (cartTotal * coupon.value) / 100;
    } else {
        discount = coupon.value;
    }

    if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
    }

    discount = Math.min(discount, cartTotal);

    if (discount <= 0) {
        return buildInvalidResponse('קופון לא תקף לסכום זה');
    }

    const roundedDiscount = Math.round(discount * 100) / 100;

    return {
        valid: true,
        discount: roundedDiscount,
        message: 'קופון הופעל בהצלחה'
    };
};

module.exports = {
    normalizeCouponCode,
    validateCouponForTotal
};
