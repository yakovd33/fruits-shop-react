import { AiOutlinePlus, AiOutlineMinus, AiOutlineClose } from 'react-icons/ai';

const Cart = ({ name, price, image, amount }) => {
    return ( 
        <div className="cart-item">
            <div className="cart-item-remove"><AiOutlineClose/></div>

            <div className="cart-item-pic">
                <img src={image} alt="" />
            </div>

            <div className="cart-item-textuals">
                <div>
                    <span className="cart-item-name">{ name }</span>
                    <span className="cart-item-price">{ price }₪</span>
                </div>
                
                <div className="cart-item-amount">
                    <div className="cart-item-form-amount">
                        <button className="cart-item-form-plus"><AiOutlineMinus/></button>
                        <input type="number" className="cart-item-form-amount-field" value="1" data-np-checked="1"/>
                        <button className="cart-item-form-minus"><AiOutlinePlus/></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Cart;