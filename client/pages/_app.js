import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Layout from "../components/Layout";
import "../styles/globals.css";
import "../styles/responsive.css";
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
	const [ cartItems, setCartItems ] = useState([]);
	const [ didCartLoad, setDidCartLoad ] = useState(false);

	useEffect(() => {
		// Localize cart
		if (didCartLoad) {
			window?.localStorage.setItem('cart', JSON.stringify(cartItems));
		}
	}, [cartItems, didCartLoad]);

    useEffect(() => {
        if (window?.localStorage && !didCartLoad) {
            setCartItems(JSON.parse(localStorage.getItem('cart')) || []);
			setDidCartLoad(true);
        }
    }, []);

	return (
		<>
			<Head>
				<title>פרי וירק ארצנו - פירות וירקות טריים</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>

			<Layout cartItems={ cartItems } setCartItems={ setCartItems }>
				<Component { ...pageProps } cartItems={ cartItems } setCartItems={ setCartItems } />
			</Layout>

			<Script src="https://cdn.enable.co.il/licenses/enable-L804575kdnhulif-0221-25262/init.js" strategy="lazyOnload" />
		</>
	);
}

export default MyApp;
