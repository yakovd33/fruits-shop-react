const router = require('express').Router();
const giftModel = require('../models/giftsModel');

// Add new gift
router.post('/', async (req, res, next) => {
    let newGift = new giftModel(req.body);
    newGift.save();
});

// Get all gifts
router.get('/', async (req, res, next) => {
    let gifts = [];

    gifts = await giftModel.find();
    
    res.status(200).json(gifts);
});

router.delete('/:id', (req, res, next) => {
    let productId = req.params.id;
    
    try {
        giftModel.findOneAndDelete({ productId }).then((re) => {
            console.log(re)
        });
    } catch (e) {
        console.log(e);
    }

    res.send('');
})

module.exports = router;