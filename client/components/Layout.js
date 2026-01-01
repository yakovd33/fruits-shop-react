import React, { useState } from 'react';
import Script from 'next/script'
import { useRouter } from 'next/router';

import Header from "./Header";
import Footer from "./Footer";
import Cart from "./Cart/Cart";


const Layout = ({ children, cartItems, setCartItems }) => {
    const [ cartTog, setCartTog ] = useState(false);
    const router = useRouter();
    const isCartPage = router.pathname === '/cart';
    const siteRootClass = [ 'website-content', 'site-root' ];

    if (isCartPage) {
        siteRootClass.push('site-root--no-cart');
    }

    return ( 
        <div className={ siteRootClass.join(' ') }>
            { !isCartPage && (
                <div className="site-root-cart">
                    <Cart cartTog={ cartTog } setCartTog={ setCartTog } cartItems={ cartItems } setCartItems={ setCartItems }/>
                </div>
            ) }

            <div className="site-root-content">
                <Header cartTog={ cartTog } setCartTog={ setCartTog } cartItems={ cartItems } setCartItems={ setCartItems }/>
                <main className="site-main-content">
                    { children }
                </main>
                <Footer/>
            </div>

            <Script src="https://cdn.enable.co.il/licenses/enable-L804575kdnhulif-0221-25262/init.js" strategy="lazyOnload"/>
        </div>
    );
}
 
export default Layout;