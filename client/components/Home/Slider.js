import React, { useState } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import LazyLoad from 'react-lazyload';

const Slider = () => {
    const [ slides, setSlides ] = useState([{
        id: 1,
        image: '/images/slides/4.jpg',
    }, {
        id: 2,
        image: '/images/slides/2.jpg',
    }, {
        id: 3,
        image: '/images/slides/farming.jpg',
    }]);

    const [ current, setCurrent ] = useState(0);

    return (
        <>
            <div id="slider-wrap">
                <div id="slider-arrows">
                    <div className="slider-arrow left" onClick={() => setCurrent((current - 1) % slides.length)}>
                        <AiOutlineRight/>
                    </div>

                    <div className="slider-arrow right" onClick={() => setCurrent((current + 1) % slides.length)}>
                        <AiOutlineLeft/>
                    </div>
                </div>

                <div id="slider-items">
                    { slides && slides.map(item =>
                        <LazyLoad height={500} once>
                            <div className="slider-item" style={{ background: `url('${item.image}')`, transform: `translateX(${current * 100}vw)` }}>
                            </div>
                        </LazyLoad>
                    ) }
                </div>
            </div>
        </>
     );
}
 
export default Slider;