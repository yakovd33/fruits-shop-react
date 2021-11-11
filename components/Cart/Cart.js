import CartItem from "./CartItem";
import { AiOutlineClose } from 'react-icons/ai';

const Cart = ({ cartTog, setCartTog }) => {
    return ( 
        <div id="cart-wrap">
            <div id="cart-bg" className={ `${ cartTog ? 'active' : '' }` } onClick={ () => setCartTog(!cartTog) }></div>

            <div id="cart" className={ `${ cartTog ? 'active' : '' }`}>
                <h3 id="cart-title"><span id="cart-close-icon" onClick={ () => setCartTog(!cartTog) }><AiOutlineClose/></span> סל הקניות שלכם</h3>

                <div id="cart-items">
                    <CartItem name="חמוציות מסוכרות" price="10" image="/images/products/hamuziot.jpg" amount="2"/>
                    <CartItem name="חמוציות מסוכרות" price="10" image="/images/products/hamuziot.jpg" amount="2"/>
                    <CartItem name="חמוציות מסוכרות" price="10" image="/images/products/hamuziot.jpg" amount="2"/>
                    <CartItem name="חמוציות מסוכרות" price="10" image="/images/products/hamuziot.jpg" amount="2"/>
                    <CartItem name="חמוציות מסוכרות" price="10" image="/images/products/hamuziot.jpg" amount="2"/>
                </div>

                <div id="cart-link-to-checkout">להמשך הזמנה</div>
            </div>
        </div>
     );
}
 
export default Cart;