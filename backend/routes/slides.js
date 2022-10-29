const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const slideModel = require('../models/heroSlide');
const s3 = require('../s3')

router.get('/', async (req, res, next) => {
    try {
        let slides = await slideModel.find();
        let finalSlides = [];

        slides.forEach(slide => {
            finalSlides.push({
                order: slide.order,
                url: slide.url
            })
        });


        res.status(200).json(slides);
    } catch (e) {
        console.log(e);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const fileContent  = Buffer.from(req.files.file.data, 'binary');
        const params = {
            Bucket: 'main-slides',
            Key: `main-slide-item-${Math.floor(Math.random() * 9999).toString()}.jpg`, // File name you want to save as in S3
            Body: fileContent 
        };
    
        // Uploading files to the bucket
        s3.upload(params, function(err, data) {
            console.log(data);
            if (err) {
                throw err;
            }
            let newSlide = new slideModel({
                url: data.Location,
                order: req.body.order
            });
            newSlide.save();
        });
    } catch (e) {
        console.log(e)
    }
    res.send('')
});

router.delete('/:slide_id', async (req, res, next) => {
    let slide_id = req.params.slide_id;
    try {
		slideModel.findOneAndDelete({ _id: new mongoose.Types.ObjectId(slide_id) }).then((re) => {
			console.log(re)
		}).error((err) => console.log(err));
	} catch (e) {
		console.log(e);
	}
    
    res.send('');
});

module.exports = router;