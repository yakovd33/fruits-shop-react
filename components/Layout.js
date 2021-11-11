import React, { useState } from 'react';

import Header from "./Header";
import Footer from "./Footer";
import Cart from "./Cart/Cart";

const Layout = ({ children }) => {
    const [ cartTog, setCartTog ] = useState(false);

    return ( 
        <div className="website-content">
            <Header cartTog={ cartTog } setCartTog={ setCartTog }/>
            <Cart cartTog={ cartTog } setCartTog={ setCartTog }/>

                { children }
                
            <Footer/>
        </div>
    );
}
 
export default Layout;