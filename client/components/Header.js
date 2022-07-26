import React, { useState, useEffect } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { BsWhatsapp, BsFillTelephoneFill } from 'react-icons/bs';
import { useSearchDebounce } from '../hooks/useSearchDebounce';
import { BiSearch } from 'react-icons/bi'
import Link from 'next/link';

const Header = ({ cartTog, setCartTog, cartItems }) => {
    const [ mobileNavTog, setMobileNavTog ] = useState(false);
    const [ catsTog, setCatsTog ] = useState(false);

    const [ keywords, setKeywords ] = useSearchDebounce(500);
    const [ searchResults, setSearchResults ] = useState([]);

    useEffect(() => {
        
    }, [keywords])

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
                        <div id="header-search-wrap">
                            <input type="text" placeholder="מה אתם מחפשים?" setKeywords={(e) => setKeywords(e.target.value)} value={keywords}/>
                            <div className="icon">
                                <BiSearch/>
                            </div>
                        </div>

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

            <div id="header-bottom">
                <div className="container">
                    <div className="right">
                        <Link href="/category/1">
                            <a className="header-bottom-link">ירקות</a>
                        </Link>

                        <Link href="/category/2">
                            <a className="header-bottom-link">פירות</a>
                        </Link>

                        <Link href="/category/3">
                            <a className="header-bottom-link">מעדנייה</a>
                        </Link>

                        <Link href="/category/4">
                            <a className="header-bottom-link">ירק ופטריות</a>
                        </Link>

                        <Link href="/category/5">
                            <a className="header-bottom-link">מזווה</a>
                        </Link>
                    </div>

                    <span id="header-bottom-center"></span>

                    <div className="left">
                        <Link href="/category/6">
                            <a className="header-bottom-link">יבשים</a>
                        </Link>

                        <Link href="/category/7">
                            <a className="header-bottom-link">מבצעים</a>
                        </Link>

                        <Link href="/category/8">
                            <a className="header-bottom-link">ירקות</a>
                        </Link>

                        <Link href="/category/9">
                            <a className="header-bottom-link">ירקות</a>
                        </Link>
                    </div>
                </div>
            </div>

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