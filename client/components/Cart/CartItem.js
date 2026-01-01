import React from 'react';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineClose } from 'react-icons/ai';

const CartItem = ({ id, name, price, image, amount, minAmount, cartItems, setCartItems }) => {
    const unitPrice = Number(price) || 0;
    const safeAmount = Number(amount) || 0;
    const totalPrice = Math.max(unitPrice * safeAmount, 0);
    const totalPriceLabel = totalPrice.toFixed(2).replace(/\.00$/, '');
    const unitPriceLabel = unitPrice.toFixed(2).replace(/\.00$/, '');

    const handleDelete = () => {
        const newCart = cartItems.filter((item) => item.name !== name);
        setCartItems(newCart);
    };

    const handlePlus = () => {
        const newCart = cartItems.map((item) => {
            if (item.name === name) {
                return { ...item, amount: amount + 1 };
            }
            return item;
        });

        setCartItems(newCart);
    };

    const handleMinus = () => {
        if (amount > minAmount) {
            const newCart = cartItems.map((item) => {
                if (item.name === name && item.amount > 1) {
                    return { ...item, amount: amount - 1 };
                }
                return item;
            });

            setCartItems(newCart);
        }
    };

    return (
        <article className="cart-item">
            <button
                type="button"
                className="cart-item-remove"
                onClick={ handleDelete }
                aria-label={ `הסרת ${ name } מהעגלה` }
            >
                <AiOutlineClose />
            </button>

            <div className="cart-item-pic">
                <img src={ image } alt={ name } />
            </div>

            <div className="cart-item-textuals">
                <div className="cart-item-row">
                    <span className="cart-item-name">{ name }</span>
                </div>

                <div className="cart-item-meta">
                    <span className="cart-item-price">{ unitPriceLabel }₪ ליחידה</span>
                    <span className="cart-item-amount-chip">{ safeAmount } יח'</span>
                </div>

                <div className="cart-item-amount">
                    <div className="cart-item-form-amount">
                        <button
                            type="button"
                            className="cart-item-form-minus"
                            onClick={ handleMinus }
                            aria-label={ `הפחתת כמות עבור ${ name }` }
                        >
                            <AiOutlineMinus />
                        </button>
                        <input
                            type="number"
                            className="cart-item-form-amount-field"
                            value={ amount }
                            readOnly
                        />
                        <button
                            type="button"
                            className="cart-item-form-plus"
                            onClick={ handlePlus }
                            aria-label={ `הוספת כמות עבור ${ name }` }
                        >
                            <AiOutlinePlus />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default CartItem;
