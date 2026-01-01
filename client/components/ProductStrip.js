import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import Link from "next/link";
import ProductShowcase from "./ProductShowcase";

const ProductStrip = ({ cartItems, setCartItems, title, products, seeAllLink = false }) => {
    const defaultResponsive = {
        superLargeDesktop: {
          breakpoint: { max: 4000, min: 0 },
          items: 6,
          slidesToSlide: 6
        },
        desktop: {
          breakpoint: { max: 3000, min: 1440 },
          items: 5,
          slidesToSlide: 5
        },
        desktopSmall: {
            breakpoint: { max: 1440, min: 1024 },
            items: 4,
            slidesToSlide: 4
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 3,
          slidesToSlide: 3
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 2,
          slidesToSlide: 1
        }
    };

    const [ isDragged, setIsDragged ] = useState(false)
    const maxVisibleItems = Math.max(...Object.values(defaultResponsive).map((cfg) => cfg.items));
    const isInfinite = (products?.length || 0) > maxVisibleItems;
    const cards = (products || []).map((product, i) => (
        <ProductShowcase
            product={product}
            id={ product._id }
            cartItems={cartItems}
            minAmount={ product.minAmount }
            setCartItems={setCartItems}
            description={ product.description }
            name={product.name}
            price={product.price}
            salePrice={product.salePrice}
            priceKg={product.priceKg}
            salePriceKg={product.salePriceKg}
            unit={product.unitType}
            badge={ product.badge }
            numberId={ product.id }
            relatedProductsPool={ products }
        />
    ));

    const ButtonGroup = ({ next, previous, isInfinite, ...rest }) => {
        const { carouselState: { currentSlide, totalItems, itemWidth, slidesToShow } } = rest;
        const disablePrev = !isInfinite && currentSlide === 0;
        const disableNext = !isInfinite && currentSlide + slidesToShow >= totalItems;

        return (
            <div className="products-strip-arrows" aria-hidden="true">
                <button
                    disabled={disablePrev}
                    className="products-strip-arrow products-strip-arrow--prev"
                    onClick={previous}
                >
                    <FaAngleRight/>
                </button>

                <button
                    disabled={disableNext}
                    className="products-strip-arrow products-strip-arrow--next"
                    onClick={next}
                >
                    <FaAngleLeft/>
                </button>
            </div>
        );
    };

    return (
    <div className="products-strip">
        {products && (
            <>
                { (title || seeAllLink) && (
                    <div className="products-strip-header">
                        { title && <h2 className="products-strip-title">{ title }</h2> }

                        { seeAllLink && (
                            <Link href={seeAllLink}>
                                <button className="products-strip-see-all-link">כל המוצרים <FaAngleLeft/></button>
                            </Link>
                        ) }
                    </div>
                ) }

                <div className="products-strip-list">
                    <Carousel
                        ssr
                        arrows={false}
                        responsive={defaultResponsive}
                        infinite={isInfinite}
                        customButtonGroup={<ButtonGroup isInfinite={isInfinite} />}
                        containerClass="products-slider-container"
                        sliderClass="products-strip-slider"
                        itemClass="products-strip-item"
                        rtl={true}
                        beforeChange={() => setIsDragged(true)}
                        afterChange={() => setIsDragged(false)}>
                        { cards }
                    </Carousel>
                </div>
            </>
        )}
    </div>
    );
};

export default ProductStrip;
