import React, { useState } from 'react';
import Script from 'next/script'

import Header from "./Header";
import Footer from "./Footer";
import Cart from "./Cart/Cart";

const Layout = ({ children, cartItems, setCartItems }) => {
    const [ cartTog, setCartTog ] = useState(false);

    return ( 
        <div className="website-content">
            <Header cartTog={ cartTog } setCartTog={ setCartTog } cartItems={ cartItems } setCartItems={ setCartItems }/>
            <Cart cartTog={ cartTog } setCartTog={ setCartTog } cartItems={ cartItems } setCartItems={ setCartItems }/>

                { children }

                <div id="bottom-contact">
                    טלפון ליצירת קשר: <a href="tel:0528629030">0528629030</a>
                </div>
                
            <Footer/>

            <Script src="https://cdn.enable.co.il/licenses/enable-L804575kdnhulif-0221-25262/init.js" strategy="lazyOnload"/>
        </div>
    );
}
 
export default Layout;