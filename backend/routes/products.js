var express = require("express");
var router = express.Router();
const productModel = require("../models/productModel");
const multer = require("multer");

// Get all products
router.get("/", async (req, res, next) => {
	res.set("content-type", "application/json");

	let page = req.query.page;
	let category_id = req.query.category;
	let search = req.query.search;

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
			filter.name = { $regex: '^' + search, $options: 'i' };
		}

		await productModel.find(filter).then(async (results) => {
			// Get total length
			result.length = results.length;

			// Get products
			result.products = await productModel
				.find(filter)
				.sort({ id: "asc" })
				.limit(20)
				.skip(20 * (page - 1));
		});
	} catch (err) {
		res.status(500).send(err._message);
	}

	res.status(200).json(result);
});

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString() + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	// reject a file
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
	fileFilter: fileFilter,
});

// Add new product
router.post("/", (req, res, next) => {});

module.exports = router;
