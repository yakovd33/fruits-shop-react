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