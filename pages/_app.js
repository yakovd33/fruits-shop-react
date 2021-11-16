import React, { useState, useEffect } from 'react';
import Layout from "../components/Layout";
import "../styles/globals.css";
import "../styles/responsive.css";

function MyApp({ Component, pageProps }) {
	const [ cartItems, setCartItems ] = useState([]);

    useEffect(() => {
        if (localStorage.getItem('cart')) {
            setCartItems(JSON.parse(localStorage.getItem('cart')));
        }
    }, []);

	const localizeCart = () => {
		localStorage.setItem('cart', JSON.stringify(cartItems));
	}

	useEffect(() => {
		localizeCart();
	}, [ cartItems ]);

	return (
		<Layout cartItems={ cartItems } setCartItems={ setCartItems }>
			<Component { ...pageProps } cartItems={ cartItems } setCartItems={ setCartItems } />
		</Layout>
	);
}

export default MyApp;
