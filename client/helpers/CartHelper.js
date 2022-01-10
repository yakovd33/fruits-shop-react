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
}