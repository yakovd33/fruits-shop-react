const express = require('express');
const router = express.Router();
const Coupon = require('../models/couponModel');
const { normalizeCouponCode, validateCouponForTotal, toNumberOrUndefined } = require('../utils/couponService');

router.get('/', async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'שגיאה בטעינת הקופונים' });
    }
});

router.post('/', async (req, res) => {
    try {
        const code = normalizeCouponCode(req.body.code);
        const value = Number(req.body.value);

        if (!code || Number.isNaN(value) || value <= 0) {
            return res.status(400).json({ message: 'קוד או ערך קופון אינם תקינים' });
        }

        const coupon = new Coupon({
            code,
            type: req.body.type === 'percentage' ? 'percentage' : 'fixed',
            value,
            minOrderTotal: Number(req.body.minOrderTotal) || 0,
            maxDiscount: toNumberOrUndefined(req.body.maxDiscount),
            usageLimit: toNumberOrUndefined(req.body.usageLimit),
            description: req.body.description,
            expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null,
            active: req.body.active !== false
        });

        await coupon.save();
        res.status(201).json(coupon);
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({ message: 'קופון עם קוד זה כבר קיים' });
        }
        console.log(error);
        res.status(500).json({ message: 'שגיאה בשמירת הקופון' });
    }
});

router.put('/:couponId', async (req, res) => {
    const { couponId } = req.params;

    try {
        const updates = {};

        if (req.body.code !== undefined) {
            updates.code = normalizeCouponCode(req.body.code);
        }

        if (req.body.type === 'percentage' || req.body.type === 'fixed') {
            updates.type = req.body.type;
        }

        if (req.body.value !== undefined) {
            const parsed = Number(req.body.value);
            if (Number.isNaN(parsed) || parsed <= 0) {
                return res.status(400).json({ message: 'ערך קופון אינו תקין' });
            }
            updates.value = parsed;
        }

        const minOrderTotal = toNumberOrUndefined(req.body.minOrderTotal);
        if (minOrderTotal !== undefined) {
            updates.minOrderTotal = minOrderTotal;
        } else if (req.body.minOrderTotal === '' || req.body.minOrderTotal === null) {
            updates.minOrderTotal = 0;
        }

        const maxDiscount = toNumberOrUndefined(req.body.maxDiscount);
        if (maxDiscount !== undefined) {
            updates.maxDiscount = maxDiscount;
        } else if (req.body.maxDiscount === '' || req.body.maxDiscount === null) {
            updates.maxDiscount = null;
        }

        const usageLimit = toNumberOrUndefined(req.body.usageLimit);
        if (usageLimit !== undefined) {
            updates.usageLimit = usageLimit;
        } else if (req.body.usageLimit === '' || req.body.usageLimit === null) {
            updates.usageLimit = null;
        }

        if (req.body.description !== undefined) {
            updates.description = req.body.description;
        }

        if (req.body.expiresAt !== undefined) {
            updates.expiresAt = req.body.expiresAt ? new Date(req.body.expiresAt) : null;
        }

        if (req.body.active !== undefined) {
            updates.active = Boolean(req.body.active);
        }

        const coupon = await Coupon.findByIdAndUpdate(couponId, updates, { new: true });

        if (!coupon) {
            return res.status(404).json({ message: 'קופון לא נמצא' });
        }

        res.json(coupon);
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({ message: 'קופון עם קוד זה כבר קיים' });
        }
        console.log(error);
        res.status(500).json({ message: 'שגיאה בעדכון הקופון' });
    }
});

router.delete('/:couponId', async (req, res) => {
    const { couponId } = req.params;

    try {
        await Coupon.findByIdAndDelete(couponId);
        res.json({ message: 'הקופון נמחק' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'שגיאה במחיקת הקופון' });
    }
});

router.post('/validate', async (req, res) => {
    try {
        const { code, cartTotal } = req.body || {};
        const result = await validateCouponForTotal(code, cartTotal);

        if (!result.valid) {
            return res.status(400).json({
                valid: false,
                discount: 0,
                message: result.message || 'הקופון אינו תקף'
            });
        }

        const coupon = result.coupon?.toObject ? result.coupon.toObject() : result.coupon;

        res.json({
            valid: true,
            discount: result.discount,
            message: result.message,
            coupon: {
                _id: coupon._id,
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                minOrderTotal: coupon.minOrderTotal,
                maxDiscount: coupon.maxDiscount,
                usageLimit: coupon.usageLimit,
                usageCount: coupon.usageCount,
                description: coupon.description,
                expiresAt: coupon.expiresAt,
                active: coupon.active
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            valid: false,
            discount: 0,
            message: 'שגיאה בבדיקת הקופון'
        });
    }
});

module.exports = router;
