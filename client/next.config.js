module.exports = {
	reactStrictMode: true,
	future: { webpack5: true },
	images: {
		domains: [process.env.PRODUCT_THUMBS_PUBLIC_BUCKET, process.env.MAIN_SLIDER_PUBLIC_BUCKET],
	},
	env: {
		API_URL: process.env.API_URL,
		PRODUCT_THUMBS_PUBLIC_BUCKET: process.env.PRODUCT_THUMBS_PUBLIC_BUCKET,
		MAIN_SLIDER_PUBLIC_BUCKET: process.env.MAIN_SLIDER_PUBLIC_BUCKET
	},
};