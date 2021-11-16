import React, { useState } from 'react';

import Header from "./Header";
import Footer from "./Footer";
import Cart from "./Cart/Cart";

const Layout = ({ children, cartItems, setCartItems }) => {
    const [ cartTog, setCartTog ] = useState(false);

    return ( 
        <div className="website-content">
            <Header cartTog={ cartTog } setCartTog={ setCartTog } cartItems={ cartItems }/>
            <Cart cartTog={ cartTog } setCartTog={ setCartTog } cartItems={ cartItems } setCartItems={ setCartItems }/>

                { children }
                
            <Footer/>
        </div>
    );
}
 
export default Layout;