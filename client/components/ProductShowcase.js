import React, { useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

const ProductShowcase = ({ name, price, image, unit, cartItems, setCartItems }) => {
    const [ amount, setAmount ] = useState(1);

    return (
        <div className="product-showcase">
            <div className="product-showcase-image">
                <img src={ image } alt=""/>
            </div>

            <div className="product-showcase-name">{ name }</div>
            <div className="product-showcase-price">{ price }₪ / { unit }</div>

            <div className="product-showcase-add-to-cart-form">
                <div className="cart-item-amount-wrap">
                    <div className="cart-item-amount">
                        <div className="cart-item-form-amount">
                            <button className="cart-item-form-plus" onClick={ () => setAmount(amount - 1) }><AiOutlineMinus/></button>
                            <input type="number" className="cart-item-form-amount-field" value={ amount } onChange={ (e) => setAmount(e.target.value) } data-np-checked="1"/>
                            <button className="cart-item-form-minus" onClick={ () => setAmount(amount + 1) }><AiOutlinePlus/></button>
                        </div>
                    </div>
                </div>

                <div className="cute-btn product-showcase-add-to-cart" onClick={ () => setCartItems(cartItems => [ ...cartItems, { name: name, amount: amount, price: price, image: image } ]) }>הוספה לעגלה</div>
            </div>
        </div>
    );
}
 
export default ProductShowcase;