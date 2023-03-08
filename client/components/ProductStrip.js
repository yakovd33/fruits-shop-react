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
          items: 1,
          slidesToSlide: 1
        }
    };

    const [ isDragged, setIsDragged ] = useState(false)
    const cards = (products || []).map((product, i) => (
        <ProductShowcase
            id={ product._id }
            cartItems={cartItems}
            minAmount={ product.minAmount }
            setCartItems={setCartItems}
            description={ product.description }
            name={product.name}
            price={product.price}
            salePrice={product.salePrice}
            unit={product.unitType}
            badge={ product.badge }
            numberId={ product.id }
        />
    ));

    const ButtonGroup = ({ next, previous, goToSlide, ...rest }) => {
        const { carouselState: { currentSlide, totalItems, itemWidth, slidesToShow } } = rest;

        return (
            <div className="products-strip-arrows">
                { seeAllLink &&
                    <Link href={seeAllLink}>
                        <button className="products-strip-see-all-link">כל המוצרים <FaAngleLeft/></button>
                    </Link>
                }
                
                <button disabled={currentSlide === 0} className="products-strip-arrow" onClick={previous}>
                    <FaAngleRight/>
                </button>

                <button disabled={currentSlide + slidesToShow >= totalItems} className="products-strip-arrow" onClick={next}>
                    <FaAngleLeft/>
                </button>
            </div>
        );
    };

    return (
    <div className="products-strip">
        {products && (
            <>
                <h2 className="products-strip-title">{title}</h2>

                <div className="products-strip-list">
                    <Carousel
                        ssr
                        arrows={false}
                        responsive={defaultResponsive}
                        customButtonGroup={<ButtonGroup />}
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
