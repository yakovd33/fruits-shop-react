import React, { useState } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import LazyLoad from 'react-lazyload';

const Slider = ({ slides }) => {
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
                            <div className="slider-item" style={{ background: `url('${item.url}')`, transform: `translateX(${current * 100}vw)` }}>
                            </div>
                        </LazyLoad>
                    ) }
                </div>
            </div>
        </>
     );
}
 
export default Slider;