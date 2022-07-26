import axios from 'axios';

export default class CartHelper {
    static getCartDiscount (cartItems, setDiscount) {
        setDiscount(0);

        cartItems.map((item) => {
            axios.get(`${process.env.API_URL}/discounts/product_discount/${ item.id }/${ item.amount }`).then(discount => {
                setDiscount((prevDis) => prevDis + parseInt(discount.data))
            })
        });

        return;
    }

    static getAmountFromLocalStorage (lsCart) {
        let amount = 0;
        let cartItems = JSON.parse(lsCart);
        
        cartItems.map((item) => {
            amount += (item.originalPrice * item.amount);
        });
        
        return amount;
    }
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