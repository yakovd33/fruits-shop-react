import React, { useRef } from 'react';
import { Carousel } from '@mantine/carousel';
import { Image } from '@mantine/core';
import Autoplay from 'embla-carousel-autoplay';

const Slider = ({ slides = [] }) => {
    const autoplay = useRef(Autoplay({ delay: 3200 }));

    return (
        <div id="slider-wrap">
            <div className="hero-carousel-frame">
                <Carousel
                    sx={{ width: '100%' }}
                    mx="auto"
                    withIndicators
                    slideGap="sm"
                    align="start"
                    loop
                    plugins={[autoplay.current]}
                    onMouseEnter={autoplay.current.stop}
                    onMouseLeave={autoplay.current.reset}
                    dir="ltr"
                >
                    { slides.map((item, index) => (
                        <Carousel.Slide key={item?._id || item?.id || item?.url || index}>
                            <div className="hero-carousel-slide">
                                <Image
                                    className="hero-carousel-image"
                                    src={item?.url}
                                    fit="cover"
                                    radius="lg"
                                    alt="סלייד בית"
                                    withPlaceholder
                                />
                            </div>
                        </Carousel.Slide>
                    )) }
                </Carousel>
            </div>
        </div>
     );
};
 
export default Slider;