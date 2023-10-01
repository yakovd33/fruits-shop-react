module.exports = {
	reactStrictMode: true,
	images: {
		remotePatterns: [{
			protocol: 'https',
			hostname: process.env.NEXT_PUBLIC_PRODUCT_THUMBS_PUBLIC_BUCKET,
			unoptimized: true
		}, {
			protocol: 'https',
			hostname: process.env.NEXT_PUBLIC_MAIN_SLIDER_PUBLIC_BUCKET,
			unoptimized: true
		},]
	},
	env: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_PRODUCT_THUMBS_PUBLIC_BUCKET: process.env.NEXT_PUBLIC_PRODUCT_THUMBS_PUBLIC_BUCKET,
		NEXT_PUBLIC_MAIN_SLIDER_PUBLIC_BUCKET: process.env.NEXT_PUBLIC_MAIN_SLIDER_PUBLIC_BUCKET
	}
};