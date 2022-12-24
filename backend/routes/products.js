var express = require("express");
var router = express.Router();
const productModel = require("../models/productModel");
const s3 = require('../s3')

// Get all products
router.get("/", async (req, res, next) => {
	res.set("content-type", "application/json");

	let { page, category_id, search, all, limit, rand, isRecommended, isHomepage, subcategory } = req.query;

	if (!page) {
		page = 1;
	}

	let result = {
		products: [],
		length: 0,
	};

	try {
		if (category_id) {
			if (category_id != 7) {
				filter = { category: category_id };

				if (subcategory) {
					filter['subCategory'] = subcategory;
				}
			} else {
				// Get all products on sale
				filter = { salePrice: { $ne: 0 } }
			}
		} else {
			filter = {};
		}

		if (search) {
			filter.name = { "$regex": search, "$options": "i" };
		}

		if (all && !limit) {
			limit = 9999;
		} else {
			if (!limit) {
				limit = 20;
			}
		}

		if (isRecommended) {
			filter.isRecommended = isRecommended;
		}

		if (isHomepage) {
			filter.isHomepage = isHomepage;
		}

		await productModel.find(filter).then(async (results) => {
			// Get total length
			result.length = results.length;

			// Get products
			if (!rand) {
				result.products = await productModel
					.find(filter)
					.sort({ id: "asc" })
					.limit(parseInt(limit))
					.skip(limit * (page - 1));
			} else {
				// Get random products
				result.products = await productModel.aggregate(
					[ { $sample: { size: parseInt(limit) } } ]
				)
			}
		});
	} catch (err) {
		res.status(500).send(err._message);
	}

	res.status(200).json(result);
});

// Delete products
router.delete("/:id", async (req, res, next) => {
	let id = req.params.id;

	res.send(id);

	if (id) {
		try {
			await productModel.deleteOne({ id: id });
		} catch (e) {
			console.log(e);
		}
		console.log(id);
	}
});

// Upload a product
router.post('/', async (req, res, next) => {	
	if (req.files.file) {
		try {
			var product_id = Date.now();
			req.body.id = product_id;

			const fileContent = Buffer.from(req.files.file.data, 'binary');
			const params = {
				Bucket: 'pryerek-product-thumbs',
				Key: `${product_id}.jpg`, // File name you want to save as in S3
				Body: fileContent 
			};
		
			// Uploading files to the bucket
			s3.upload(params, (err, data) => {
				if (err) {
					throw err;
				}

				let newProduct = new productModel(req.body);
				newProduct.save();
			});

			res.json({
				msg: 'מוצר נוסף בהצלחה',
				id: product_id
			});
		} catch (e) {
			console.log(e);
		}
	} else {
		res.send('');
	}
});

// Edit product
router.post('/update/:id', async (req, res, next) => {
	let id = req.params.id;

	try {
		productModel.findOneAndUpdate({ id: id }, {
			$set: req.body
		}, { upsert: true, new: true }, (err, docs) => {
			if (!err) res.send('שינוי בוצע בהצלחה.')
		});
	} catch (e) {
		console.log(e);
		res.send('')
	}
});


// Update thumb
router.post('/update_thumb/:id', async (req, res, next) => {
	let id = req.params.id;

	try {
		if (req.files?.file) {
			const fileContent = Buffer.from(req.files.file.data, 'binary');
			const params = {
				Bucket: 'pryerek-product-thumbs',
				Key: `${id}.jpg`,
				Body: fileContent 
			};
			s3.upload(params, (err, data) => {});
		}
	} catch (e) {
		console.log(e);
	}

	res.send('')
});

// Get product details
router.get('/:id', async (req, res, next) => {
	const productId = req.params.id;
	const product = await productModel.findOne({ id: productId });
	res.status(200).json(product || null);
});

module.exports = router;
