import React, { useState } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';

const Header = ({ cartTog, setCartTog }) => {
    const [ mobileNavTog, setMobileNavTog ] = useState(false);

    return (
        <div id="header">
            <div id="header-right">
                <div id="header-logo"><img src="/images/logo.svg" alt="" /></div>
                <div id="header-links" className={ `${ mobileNavTog ? 'active' : '' }` }>
                    <a className="header-link active">דף הבית</a>
                    <a className="header-link">אודות</a>
                    <a className="header-link">קטגוריות</a>
                    <a className="header-link">תקנון</a>
                </div>
            </div>

            <div id="header-left">
                <div id="header-cart-icon" onClick={ () => setCartTog(!cartTog) }>
                    <div className="icon"><AiOutlineShoppingCart/></div>
                    <div className="number">2</div>
                </div>
            </div>

            <div id="mobile-menu-tog" onClick={ () => setMobileNavTog(!mobileNavTog) }>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
}
 
export default Header;