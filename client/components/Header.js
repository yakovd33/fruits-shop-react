import React, { useState } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { BsWhatsapp, BsFillTelephoneFill } from 'react-icons/bs';
import Link from 'next/link';
import HeaderBottom from './HeaderBottom';
import HeaderSearch from './HeaderSearch';

const Header = ({ cartTog, setCartTog, cartItems }) => {
    const [ mobileNavTog, setMobileNavTog ] = useState(false);
    const [ catsTog, setCatsTog ] = useState(false);

    return (
        <>
            <div id="header">
                <div className="container">
                    <div id="header-right">
                        <Link href="/"><a><div id="header-logo"><img src="/images/logo.png" alt="" /></div></a></Link>
                        <div id="header-links" className={ `${ mobileNavTog ? 'active' : '' }` }>
                            <Link href="/"><a className="header-link active">דף הבית</a></Link>
                            <Link href="/about"><a className="header-link">אודות</a></Link>
                            <Link href="/legal"><a className="header-link">תקנון</a></Link>
                        </div>
                    </div>

                    <div id="header-left">
                       <HeaderSearch/>

                        <div id="header-cart-icon" onClick={ () => setCartTog(!cartTog) }>
                            <div className="icon"><AiOutlineShoppingCart/></div>
                            <div className="number">{ cartItems.length }</div>
                        </div>
                    </div>

                    <div id="mobile-menu-tog" onClick={ () => setMobileNavTog(!mobileNavTog) }>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>

            <HeaderBottom/>

            <a href="https://api.whatsapp.com/send?phone=972528629030&amp;text=שלום פרי וירק ארצנו." className="float" target="_blank" rel="noreferrer">
                <BsWhatsapp/>
            </a>

            <a href="tel:0528629030" id="call-btn">
                <BsFillTelephoneFill/>
            </a>
        </>
    );
}
 
export default Header;