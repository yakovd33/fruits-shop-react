import axios from 'axios';

export const getCartDiscount = (cartItems, setDiscount) => {
    setDiscount(0);

    cartItems.map((item) => {
        axios.get(`${process.env.API_URL}/discounts/product_discount/${ item.id }/${ item.amount }`).then(discount => {
            setDiscount((prevDis) => prevDis + parseInt(discount.data))
        })
    });

    return;
}

export const getAmountFromLocalStorage = (lsCart) => {
    let amount = 0;
    let cartItems = JSON.parse(lsCart);
    
    cartItems.map((item) => {
        amount += (item.originalPrice * item.amount);
    });
    
    return amount;
}

export const addToCartAnimation = (imageTag, top, left) => {
    let id = 'add-to-cart-animation-item-' + Math.floor(Math.random() * 1000).toString();
    const element = document.createElement('div');
    element.setAttribute('id', id);
    element.setAttribute('class', 'add-to-cart-animation-item');
    element.setAttribute('style', `top: ${top}px; left: ${left}px`);
    element.innerHTML = imageTag;
    document.body.appendChild(element);

    setTimeout(() => {
        document?.getElementById(id)?.remove();
    }, 3000, id);
}

export const productHandlePlus = (id, cart, setCart, cartAmount, setCartAmount) => {
    let existsInCart = false;
    setCartAmount(cartAmount + 1)

    let newCart = cart.map((cartItem, i) => {
        if (cartItem.id == id) {
            existsInCart = true;
            return { ...cartItem, amount: cartItem.amount + 1 };
        } else return cartItem
    });

    setCart(newCart);
}

export const productHandleMinus = (id, cart, setCart, cartAmount, setCartAmount) => {
    if (cartAmount > 1) {
        setCartAmount(cartAmount - 1)

        let newCart = cart.map((cartItem, i) => {
            if (cartItem.id == id) {
                return { ...cartItem, amount: cartItem.amount - 1 };
            } else return cartItem
        });

        setCart(newCart)
    } else {
        handleRemoveFromCart(id, setCart)
    }
}

export const handleRemoveFromCart = (id, setCart) => {
    setCart((prevCart) =>
        prevCart.filter((cartItem) => cartItem.id !== id)
    );
}