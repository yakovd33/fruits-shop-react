import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineClose } from 'react-icons/ai';

const CartItem = ({ id, name, price, image, amount, minAmount, cartItems, setCartItems }) => {
    const handleDelete = () => {
        const newCart = cartItems.filter((item) => item.name !== name);
        setCartItems(newCart);  
    }

    const handlePlus = () => {
        let newCart = cartItems.map((item, i) => {
            if (item.name == name) {
                return { ...item, amount: amount + 1 };
            } else return item
        });

        setCartItems(newCart);
    }

    const handleMinus = () => {
        if (amount > minAmount) {
            let newCart = cartItems.map((item, i) => {
                if (item.name == name) {
                    if (item.amount > 1) {
                        return { ...item, amount: amount - 1 };
                    } else return item
                } else return item;
            });

            setCartItems(newCart)
        }
    }

    return ( 
        <div className="cart-item">
            <div className="cart-item-remove" onClick={ handleDelete }><AiOutlineClose/></div>

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
                        <button className="cart-item-form-plus" onClick={ handleMinus }><AiOutlineMinus/></button>
                        <input type="number" className="cart-item-form-amount-field" value={ amount } data-np-checked="1"/>
                        <button className="cart-item-form-minus" onClick={ handlePlus }><AiOutlinePlus/></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default CartItem;