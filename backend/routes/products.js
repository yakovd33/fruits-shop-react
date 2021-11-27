var express = require("express");
var router = express.Router();
const productModel = require("../models/productModel");
const multer = require("multer");
const path = require("path");

// Get all products
router.get("/", async (req, res, next) => {
	res.set("content-type", "application/json");

	let page = req.query.page;
	let category_id = req.query.category;
	let search = req.query.search;
	let all = req.query.all;

	if (!page) {
		page = 1;
	}

	let result = {
		products: [],
		length: 0,
	};

	try {
		if (category_id) {
			filter = { category: category_id };
		} else {
			filter = {};
		}

		if (search) {
			filter.name = { "$regex": search, "$options": "i" };
		}

		if (all) {
			limit = 999;
		} else {
			limit = 20;
		}

		await productModel.find(filter).then(async (results) => {
			// Get total length
			result.length = results.length;

			// Get products
			result.products = await productModel
				.find(filter)
				.sort({ id: "asc" })
				.limit(limit)
				.skip(limit * (page - 1));
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

const MIME_TYPE_MAP = {
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'image/jpg': 'jpg'
};  

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'uploads')
	},
	filename: function (req, file, cb) {
		const ext = MIME_TYPE_MAP[file.mimetype];
		cb(null, Date.now() + '.' + ext);
	  	// cb(null, Date.now())
	}
  })
   
var upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res, next) => {
	let file = req.file;
	
	if (file) {
		try {
			let file_id = file.filename.split('.')[0];
			req.body.id = file_id
			let newProduct = new productModel(req.body);
			await newProduct.save();
			// console.log(req);
			
			res.send('מוצר נוסף בהצלחה');
		} catch (e) {
			console.log(e);
		}
	}
});

router.post('/update/:id', async (req, res, next) => {
	let id = req.params.id;

	try {
		productModel.findOneAndUpdate({ id: id }, {
			$set: { 'price': req.body.price }
		}, (err, docs) => {
			if (!err) res.send('שינוי בוצע בהצלחה.')
		})
	} catch (e) {
		console.log(e);
	}
});

module.exports = router;
