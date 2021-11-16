import React, { useState } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { BsWhatsapp } from 'react-icons/bs';
import { FaAngleDown } from 'react-icons/fa';
import Link from 'next/link';

const Header = ({ cartTog, setCartTog, cartItems }) => {
    const [ mobileNavTog, setMobileNavTog ] = useState(false);
    const [ catsTog, setCatsTog ] = useState(false);

    return (
        <>
            <div id="header">
                <div id="header-right">
                    <Link href="/"><div id="header-logo"><img src="/images/logo.svg" alt="" /></div></Link>
                    <div id="header-links" className={ `${ mobileNavTog ? 'active' : '' }` }>
                        <Link href="/"><a className="header-link active">דף הבית</a></Link>
                        <Link href="/about"><a className="header-link">אודות</a></Link>

                        <a className="header-link dropdown-link" onClick={ () => setCatsTog(!catsTog) }>
                            <span>קטגוריות <FaAngleDown/></span>          
                            { catsTog && <div className="dropdown">
                                <Link href="/category/1"><a>ירקות</a></Link>
                                <Link href="/category/2"><a>פירות</a></Link>
                                <Link href="/category/3"><a>מעדנייה</a></Link>
                                <Link href="/category/4"><a>ירק ופטריות</a></Link>
                                <Link href="/category/5"><a>מזווה</a></Link>
                                <Link href="/category/6"><a>יבשים</a></Link>
                                <Link href="/category/7"><a>מבצעים</a></Link>
                            </div> }
                        </a>

                        <Link href="/legal"><a className="header-link">תקנון</a></Link>
                    </div>
                </div>

                <div id="header-left">
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

            <a href="https://api.whatsapp.com/send?phone=972528629030&amp;text=שלום פרי וירק ארצנו." class="float" target="_blank">
                <BsWhatsapp/>
            </a>
        </>
    );
}
 
export default Header;