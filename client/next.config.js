module.exports = {
	reactStrictMode: true,
	future: { webpack5: true },
	images: {
		domains: ['eropa.co.il', 'pryerek-product-thumbs.s3.eu-central-1.amazonaws.com', 'main-slides.s3.amazonaws.com'],
	},
	env: {
		// API_URL: "http://localhost:4000",
		API_URL: 'https://api.pryerek.co.il',
	},
};