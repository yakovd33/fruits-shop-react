const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Coupon = require('../models/couponModel');
const { normalizeCouponCode, validateCouponForTotal } = require('../utils/couponUtils');

const serializeCoupon = (coupon) => ({
    _id: coupon._id,
    code: coupon.code,
    description: coupon.description,
    type: coupon.type,
    value: coupon.value,
    minOrderTotal: coupon.minOrderTotal,
    maxDiscount: coupon.maxDiscount,
    usageLimit: coupon.usageLimit,
    usageCount: coupon.usageCount,
    active: coupon.active,
    expiresAt: coupon.expiresAt,
    createdAt: coupon.createdAt
});

router.get('/', async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json(coupons.map(serializeCoupon));
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בטעינת הקופונים', error: error.toString() });
    }
});

router.post('/', async (req, res) => {
    try {
        const code = normalizeCouponCode(req.body.code);
        const type = req.body.type === 'percentage' ? 'percentage' : 'fixed';
        const value = Number(req.body.value);
        const minOrderTotal = req.body.minOrderTotal ? Number(req.body.minOrderTotal) : 0;
        const maxDiscount = req.body.maxDiscount ? Number(req.body.maxDiscount) : undefined;
        const usageLimit = req.body.usageLimit ? Number(req.body.usageLimit) : undefined;
        const active = req.body.active !== undefined ? Boolean(req.body.active) : true;
        const description = req.body.description || '';
        let expiresAt;
        if (req.body.expiresAt) {
            const tmpDate = new Date(req.body.expiresAt);
            if (Number.isNaN(tmpDate.getTime())) {
                return res.status(400).json({ message: 'תאריך תפוגה לא תקין' });
            }
            expiresAt = tmpDate;
        }

        if (!code) {
            return res.status(400).json({ message: 'יש להזין קוד קופון' });
        }

        if (Number.isNaN(value) || value <= 0) {
            return res.status(400).json({ message: 'יש להזין ערך הנחה תקין' });
        }

        const coupon = new Coupon({
            code,
            description,
            type,
            value,
            minOrderTotal,
            maxDiscount,
            usageLimit,
            active,
            expiresAt
        });

        await coupon.save();
        res.status(201).json(serializeCoupon(coupon));
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'קופון עם קוד זה כבר קיים' });
        }

        res.status(500).json({ message: 'שגיאה ביצירת קופון', error: error.toString() });
    }
});

router.put('/:couponId', async (req, res) => {
    try {
        const { couponId } = req.params;
        const update = {};

        if (req.body.code) {
            update.code = normalizeCouponCode(req.body.code);
        }

        if (req.body.description !== undefined) {
            update.description = req.body.description;
        }

        if (req.body.type) {
            update.type = req.body.type === 'percentage' ? 'percentage' : 'fixed';
        }

        if (req.body.value !== undefined) {
            const value = Number(req.body.value);
            if (Number.isNaN(value) || value <= 0) {
                return res.status(400).json({ message: 'ערך הנחה לא תקין' });
            }
            update.value = value;
        }

        if (req.body.minOrderTotal !== undefined) {
            update.minOrderTotal = Number(req.body.minOrderTotal) || 0;
        }

        if (req.body.maxDiscount !== undefined) {
            update.maxDiscount = (req.body.maxDiscount === null || req.body.maxDiscount === '') ? undefined : Number(req.body.maxDiscount);
        }

        if (req.body.usageLimit !== undefined) {
            update.usageLimit = (req.body.usageLimit === null || req.body.usageLimit === '') ? undefined : Number(req.body.usageLimit);
        }

        if (req.body.active !== undefined) {
            update.active = Boolean(req.body.active);
        }

        if (req.body.expiresAt !== undefined) {
            if (!req.body.expiresAt) {
                update.expiresAt = undefined;
            } else {
                const tmpDate = new Date(req.body.expiresAt);
                if (Number.isNaN(tmpDate.getTime())) {
                    return res.status(400).json({ message: 'תאריך תפוגה לא תקין' });
                }
                update.expiresAt = tmpDate;
            }
        }

        const coupon = await Coupon.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(couponId) },
            { $set: update },
            { new: true }
        );

        if (!coupon) {
            return res.status(404).json({ message: 'קופון לא נמצא' });
        }

        res.status(200).json(serializeCoupon(coupon));
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'קוד קופון כבר בשימוש' });
        }

        res.status(500).json({ message: 'שגיאה בעדכון קופון', error: error.toString() });
    }
});

router.delete('/:couponId', async (req, res) => {
    try {
        const { couponId } = req.params;
        await Coupon.findOneAndDelete({ _id: new mongoose.Types.ObjectId(couponId) });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'שגיאה במחיקת קופון', error: error.toString() });
    }
});

router.post('/validate', async (req, res) => {
    try {
        const code = normalizeCouponCode(req.body.code);
        const cartTotal = Number(req.body.cartTotal) || 0;

        if (!code) {
            return res.status(400).json({ valid: false, message: 'אנא הזן קוד קופון' });
        }

        const coupon = await Coupon.findOne({ code });
        const validation = validateCouponForTotal(coupon, cartTotal);

        if (!validation.valid) {
            return res.status(200).json({
                valid: false,
                message: validation.message,
                discount: 0,
                newTotal: cartTotal,
                coupon: coupon ? serializeCoupon(coupon) : null
            });
        }

        res.status(200).json({
            valid: true,
            message: validation.message,
            discount: validation.discount,
            newTotal: Math.max(cartTotal - validation.discount, 0),
            coupon: serializeCoupon(coupon)
        });
    } catch (error) {
        res.status(500).json({ valid: false, message: 'שגיאה בבדיקת הקופון', error: error.toString() });
    }
});

module.exports = router;
