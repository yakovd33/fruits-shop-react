import React, { useRef } from 'react';
import { Carousel } from '@mantine/carousel';
import { Image } from '@mantine/core';
import Autoplay from 'embla-carousel-autoplay';

const Slider = ({ slides }) => {
    const autoplay = useRef(Autoplay({ delay: 3000 }));

    return (
        <>
            <div id="slider-wrap">
                <Carousel sx={{  }} mx="auto" withIndicators height={500} plugins={[autoplay.current]} onMouseEnter={autoplay.current.stop} onMouseLeave={autoplay.current.reset} dir="ltr">
                    { slides && slides.map(item =>
                        <Carousel.Slide>
                            <Image src={item.url} height={500}/>
                        </Carousel.Slide>
                    ) }
                </Carousel>
            </div>
        </>
     );
}
 
export default Slider;