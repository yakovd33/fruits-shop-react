import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductShowcase from '../ProductShowcase';

const CartSuggestions = ({ cartItems, setCartItems, cartTog, orderFormTog }) => {
    const [ products, setProducts ] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.API_URL}/products/?limit=6&rand=true`).then((res) => {
            setProducts(res.data.products);
        });
    }, []);

	return (
		<div id="cart-suggestions" className={ `${ (cartTog && !orderFormTog) ? 'active' : '' }` }>
			<div id="cart-suggestions-textuals">
				<h4>לפני שאתם מסיימים רכישה</h4>
				<h3>אנחנו ממליצים לכם להוסיף לעגלה גם</h3>
			</div>

            <div id="cart-suggestions-showcases">
                { products && products.map((product) => (<ProductShowcase id={ product._id }
									cartItems={cartItems}
									minAmount={ product.minAmount }
									setCartItems={setCartItems}
									description={ product.description }
									name={product.name}
									price={product.price}
									salePrice={product.salePrice}
									unit={product.unitType}
									badge={ product.badge }
                                    bottomAddToCart={ true }
									image={`https://eropa.co.il/fruits/uploads/${product.id}.jpg `}/>)) }
            </div>
		</div>
	);
};

export default CartSuggestions;
