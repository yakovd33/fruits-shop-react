const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const citiesModel = require('../models/cityModel');

router.get('/', async (req, res, next) => {
    try {
        let cities = await citiesModel.find();
        res.status(200).json(cities);
    } catch (e) {
        console.log(e);
    }
});

router.post('/', async (req, res, next) => {
    try {
        let newCity = new citiesModel(req.body);
        newCity.save();
    } catch (e) {
        console.log(e)
    }
});

router.delete('/:city_id', async (req, res, next) => {
    let city_id = req.params.city_id;
    try {
		citiesModel.findOneAndDelete({ _id: new mongoose.Types.ObjectId(city_id) }).then((re) => {
			console.log(re)
		}).error((err) => console.log(err));
	} catch (e) {
		console.log(e);
	}
    
    res.send('');
});

module.exports = router;