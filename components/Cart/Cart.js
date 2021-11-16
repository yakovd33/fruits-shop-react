import React, { useState, useEffect } from 'react';
import CartItem from "./CartItem";
import { AiOutlineClose } from 'react-icons/ai';

const Cart = ({ cartTog, setCartTog, cartItems, setCartItems }) => {
    return ( 
        <div id="cart-wrap">
            <div id="cart-bg" className={ `${ cartTog ? 'active' : '' }` } onClick={ () => setCartTog(!cartTog) }></div>

            <div id="cart" className={ `${ cartTog ? 'active' : '' }`}>
                <h3 id="cart-title"><span id="cart-close-icon" onClick={ () => setCartTog(!cartTog) }><AiOutlineClose/></span> סל הקניות שלכם</h3>

                <div id="cart-items">
                    { cartItems.map((item) => (
                        <CartItem name={ item.name } price={ item.price } image={ item.image } amount={ item.amount } cartItems= { cartItems } setCartItems={ setCartItems }/>
                    )) }

                   <p className={ `${ cartItems.length ? 'hide' : '' }` }>העגלה ריקה, אולי תוסיפו קצת ירקות?</p>
                </div>

                <div id="cart-link-to-checkout">להמשך הזמנה</div>
            </div>
        </div>
     );
}
 
export default Cart;