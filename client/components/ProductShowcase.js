import React, { useState, useEffect } from 'react';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineShoppingCart } from 'react-icons/ai';
import CartHelper from '../helpers/CartHelper';
import axios from 'axios';

const ProductShowcase = ({ id, name, price, salePrice, description, minAmount, badge, image, unit, cartItems, setCartItems, bottomAddToCart }) => {
    const [ amount, setAmount ] = useState(minAmount);
    const [ discount, setDiscount ] = useState(0);

    useEffect(() => {
        setAmount(minAmount);
    }, [ minAmount ])

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
            let finalPrice = (salePrice) ? salePrice : price;
            setCartItems(cartItems => [ ...cartItems, { id, name, amount, minAmount, originalPrice: price, price: finalPrice, image } ]);
        } else {
            let newCart = cartItems.map((item, i) => {
                if (item.name == name) return { ...item, amount: item.amount + 1 };
                else return item
            });
    
            setCartItems(newCart);
        }

        // Update discounts
        setDiscount(0);

        cartItems.map((item) => {
            axios.get(`${process.env.API_URL}/discounts/product_discount/${ item.id }/${ item.amount }`).then(discount => {
                setDiscount((prevDis) => prevDis + parseInt(discount.data))
            })
        });
        // CartHelper.getCartDiscount(cartItems, setDiscount);
    }

    useEffect(() => {
        localStorage.setItem('discount', discount);
    }, [ discount ]);

    return (
        <div className="product-showcase">
            { badge && <span className="discount-badge">{ badge }</span> }
            
            { <span className={ `sale-badge ${salePrice && salePrice != 0 ? 'vis' : ''}` }>במבצע</span> }
            <div className="product-showcase-image">
                <img src={ image } alt=""/>
            </div>

            <div className="product-showcase-name">{ name }</div>
            <div className="product-showcase-price">
                <span className={ `showcase-price ${!salePrice ? 'db' : 'dn'} `}>
                    {`${!salePrice ? `${price}₪` : ''}`}
                </span>
                
                <span className={ `showcase-price ${salePrice ? 'db' : 'dn'} `}>
                    <span className="new-price">{salePrice}₪</span>
                    <span className="old-price">{price}₪</span>
                </span>

                / { unit }
            </div>

            { description && <div className="product-description">{ description }</div> }

            <div className="product-showcase-add-to-cart-form">
                <div className="cart-item-amount-wrap">
                    <div className="cart-item-amount">
                        <div className="cart-item-form-amount">
                            <button className="cart-item-form-plus" onClick={ () => { if (amount > minAmount) setAmount(amount - 1) } }><AiOutlineMinus/></button>
                            <input type="number" className="cart-item-form-amount-field" value={ amount } onChange={ (e) => setAmount(e.target.value) } data-np-checked="1"/>
                            <button className="cart-item-form-minus" onClick={ () => setAmount(amount + 1) }><AiOutlinePlus/></button>
                        </div>
                    </div>
                </div>

                <div className="cute-btn product-showcase-add-to-cart" onClick={ handleAddToCart }>הוספה לעגלה</div>

                { bottomAddToCart &&  <div className="cute-btn product-showcase-add-to-cart bottom" onClick={ handleAddToCart }><AiOutlineShoppingCart/></div> }
            </div>
        </div>
    );
}
 
export default ProductShowcase;