import React, { useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
// var parse = require('html-react-parser');

const ProductShowcase = ({ name, price, salePrice, image, unit, cartItems, setCartItems }) => {
    const parse = (html) => {
        return html;
    }

    const [ amount, setAmount ] = useState(1);

    const handleAddToCart = () => {
        document.getElementById("header-cart-icon").setAttribute('class', 'grow');

        setTimeout(() => {
            document.getElementById("header-cart-icon").setAttribute('class', '');
        }, 500);

        let found = false;

        cartItems.map((item) => {
            if (item.name == name) {
                found = true;
            }
        });

        if (!found) {
            setCartItems(cartItems => [ ...cartItems, { name: name, amount: amount, price: price, image: image } ]);
        } else {
            let newCart = cartItems.map((item, i) => {
                if (item.name == name) return { ...item, amount: item.amount + 1 };
                else return item
            });
    
            setCartItems(newCart);
        }
    }

    return (
        <div className="product-showcase">
            <div className="product-showcase-image">
                <img src={ image } alt=""/>
            </div>

            <div className="product-showcase-name">{ name }</div>
            <div className="product-showcase-price">
                { parse(`${!salePrice ? `${price}₪` : `<span className="old-price">${price}₪</span> <span className="new-price">${salePrice}₪</span>`}`) } / { unit }
            </div>

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

                <div className="cute-btn product-showcase-add-to-cart" onClick={ handleAddToCart }>הוספה לעגלה</div>
            </div>
        </div>
    );
}
 
export default ProductShowcase;