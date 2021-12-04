import React, { useState, useEffect } from 'react';
import CartItem from "./CartItem";
import { AiOutlineClose } from 'react-icons/ai';
import OrderForm from '../OrderForm';

const Cart = ({ cartTog, setCartTog, cartItems, setCartItems }) => {
    const [ orderFormTog, setOrderFormTog ] = useState(false);
    const [ cartSum, setCartSum ] = useState(0);
    const [ cartSumBeforeDiscounts, setCartSumBeforeDiscounts ] = useState(0);

    useEffect(() => {
        let sum = 0;
        let sum2 = 0;

        cartItems.map((item) => {
            sum += (item.price * item.amount);
            sum2 += (item.originalPrice * item.amount);
        });

        setCartSum(sum);
        setCartSumBeforeDiscounts(sum2);
    }, [ cartItems ]);

    return ( 
        <div id="cart-wrap">
            <div id="cart-bg" className={ `${ (cartTog || orderFormTog) ? 'active' : '' }` } onClick={ () => { setCartTog(!cartTog); setOrderFormTog(false) } }></div>

            <div id="cart" className={ `${ (cartTog && !orderFormTog) ? 'active' : '' }`}>
                <h3 id="cart-title"><span id="cart-close-icon" onClick={ () => setCartTog(!cartTog) }><AiOutlineClose/></span> סל הקניות שלכם</h3>

                <div id="cart-items">
                    { cartItems.map((item) => (
                        <CartItem name={ item.name } minAmount={ item.minAmount } price={ item.price } image={ item.image } amount={ item.amount } cartItems= { cartItems } setCartItems={ setCartItems }/>
                    )) }

                   <p className={ `${ cartItems.length ? 'hide' : '' }` }>העגלה ריקה, אולי תוסיפו קצת ירקות?</p>
                </div>

                <div id="cart-sum">
                    { (cartSumBeforeDiscounts != cartSum) && <div><strong>סכום לפני הנחה: </strong> { cartSumBeforeDiscounts }₪</div> }
                    <div><strong>סיכום הזמנה: </strong> { cartSum }₪</div>
                </div>

                <div id="cart-link-to-checkout" onClick={ () => setOrderFormTog(!orderFormTog) }>להמשך הזמנה</div>
            </div>

            { orderFormTog && <OrderForm setOrderFormTog={ setOrderFormTog }/> }
        </div>
     );
}
 
export default Cart;