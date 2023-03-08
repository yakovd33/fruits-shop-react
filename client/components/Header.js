import React, { useState, useEffect } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { BsWhatsapp, BsFillTelephoneFill } from 'react-icons/bs';
import Link from 'next/link';
import HeaderBottom from './HeaderBottom';
import HeaderSearch from './HeaderSearch';
import { FaAngleDown } from 'react-icons/fa'
import { useRouter } from 'next/router'
import MobileNav from './MobileNav';
import axios from 'axios';

const Header = ({ cartTog, setCartTog, cartItems, setCartItems }) => {
    const [ mobileNavTog, setMobileNavTog ] = useState(false);
    const [ catsTog, setCatsTog ] = useState(false);
    const router = useRouter()

    const goToLink = (link) => {
        router.push(link);
        setMobileNavTog(false);
        setCatsTog(false)
    }

    const [ subCategories, setSubCategories ] = useState([]);

    useEffect(() => {
        // Get subcategories
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subcategories`).then((res) => {
            setSubCategories(res.data)
        }).catch((e) => {
            console.log(e);
        });
    }, []);

    return (
        <>
            <div id="header">
                <div className="container">
                    <div id="header-right">
                        <Link href="/"><div id="header-logo"><img src="/images/logo.png" alt="" /></div></Link>
                        <div id="header-links">
                            <Link href="/" onClick={() => setMobileNavTog(false)} className="header-link active">דף הבית</Link>
                            <Link href="/about" onClick={() => setMobileNavTog(false)} className="header-link">אודות</Link>

                            <a className="header-link dropdown-link" onClick={ () => setCatsTog(!catsTog) }>
                                <span>קטגוריות <FaAngleDown/></span>
                                { catsTog && <div className="dropdown">
                                    <div onClick={() => goToLink("/category/1")}>ירקות</div>
                                    <div onClick={() => goToLink("/category/2")}>פירות</div>
                                    <div onClick={() => goToLink("/category/3")}>מעדנייה</div>
                                    <div onClick={() => goToLink("/category/4")}>ירק ופטריות</div>
                                    <div onClick={() => goToLink("/category/5")}>מזווה</div>
                                    <div onClick={() => goToLink("/category/6")}>יבשים</div>
                                    <div onClick={() => goToLink("/category/7")}>מבצעים</div>
                                </div> }
                            </a>
                        
                            <Link href="/legal" onClick={() => setMobileNavTog(false)} className="header-link">תקנון</Link>
                        </div>
                    </div>

                    <div id="header-left">
                       <HeaderSearch cartItems={cartItems} setCartItems={setCartItems}/>

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

            <MobileNav mobileNavTog={mobileNavTog} setMobileNavTog={setMobileNavTog} subCategories={subCategories}/>

            <HeaderBottom subCategories={subCategories}/>

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