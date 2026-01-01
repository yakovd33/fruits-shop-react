import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import ProductShowcase from '../ProductShowcase';

const CartSuggestions = ({
	cartItems,
	setCartItems,
	cartTog,
	orderFormTog,
	variant = 'panel',
	showHeading = true,
}) => {
	const [ products, setProducts ] = useState([]);
	const isSlider = variant === 'slider';
	const autoplay = useRef(Autoplay({ delay: 4200, stopOnInteraction: false }));

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/?limit=9&rand=true`).then((res) => {
            setProducts(res.data.products);
        });
    }, []);

    const suggestionItems = (products || []).map((product) => (
		<ProductShowcase
			key={ product._id }
			id={ product._id }
			product={ product }
			cartItems={ cartItems }
			minAmount={ product.minAmount }
			setCartItems={ setCartItems }
			description={ product.description }
			name={ product.name }
			price={ product.price }
			salePrice={ product.salePrice }
			priceKg={ product.priceKg }
			salePriceKg={ product.salePriceKg }
			unit={ product.unitType }
			badge={ product.badge }
			bottomAddToCart={ true }
			numberId={ product.id }
			instantCartControls
			relatedProductsPool={ products }
		/>
	));

	if (isSlider) {
		if (!products.length) {
			return null;
		}

		const hasMultipleSlides = products.length > 1;
		const carouselSlides = products.map((product) => (
			<Carousel.Slide key={ product._id || product.id }>
				<ProductShowcase
					id={ product._id }
					product={ product }
					cartItems={ cartItems }
					minAmount={ product.minAmount }
					setCartItems={ setCartItems }
					description={ product.description }
					name={ product.name }
					price={ product.price }
					salePrice={ product.salePrice }
					priceKg={ product.priceKg }
					salePriceKg={ product.salePriceKg }
					unit={ product.unitType }
					badge={ product.badge }
					bottomAddToCart={ true }
					numberId={ product.id }
					instantCartControls
					relatedProductsPool={ products }
				/>
			</Carousel.Slide>
		));

		return (
			<div className="cart-suggestions-inline" aria-label="מוצרים מומלצים להוספה לעגלה">
				<Carousel
					slideSize="33.3333%"
					slideGap="md"
					align="start"
					dragFree
					loop={ products.length > 3 }
					withIndicators={ false }
					withControls={ hasMultipleSlides }
					controlSize={ 38 }
					dir="rtl"
					plugins={ hasMultipleSlides ? [ autoplay.current ] : [] }
					onMouseEnter={ hasMultipleSlides ? autoplay.current.stop : undefined }
					onMouseLeave={ hasMultipleSlides ? autoplay.current.reset : undefined }
					breakpoints={ [
						{ maxWidth: 1100, slideSize: '50%' },
						{ maxWidth: 640, slideSize: '85%' },
					] }
				>
					{ carouselSlides }
				</Carousel>
			</div>
		);
	}

	return (
		<div id="cart-suggestions" className={ `${ (cartTog && !orderFormTog) ? 'active' : '' }` }>
			{ showHeading && (
				<div id="cart-suggestions-textuals">
					<h4>לפני שאתם מסיימים רכישה</h4>
					<h3>אנחנו ממליצים לכם להוסיף לעגלה גם</h3>
				</div>
			) }

			<div id="cart-suggestions-showcases">
				{ suggestionItems }
			</div>
		</div>
	);
};

export default CartSuggestions;
