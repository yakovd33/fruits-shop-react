import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Layout from "../components/Layout";
import "../styles/globals.css";
import "../styles/responsive.css";
import Script from 'next/script';
import globalStore from '../stores/GlobalStore';
import { ProductPopup } from '../components/Layout/ProductPopup';
import { observer } from 'mobx-react';
import SplashScreen from '../components/SplashScreen';

function MyApp({ Component, pageProps }) {
	const [ cartItems, setCartItems ] = useState([]);
	const [ didCartLoad, setDidCartLoad ] = useState(false);
	const [ showSplash, setShowSplash ] = useState(true);
	const [ isSplashLeaving, setIsSplashLeaving ] = useState(false);
	const [ isMobileViewport, setIsMobileViewport ] = useState(false);

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

	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		const mediaQuery = window.matchMedia('(max-width: 640px)');
		const handleViewportChange = (event) => setIsMobileViewport(event.matches);

		handleViewportChange(mediaQuery);

		if (typeof mediaQuery.addEventListener === 'function') {
			mediaQuery.addEventListener('change', handleViewportChange);
			return () => mediaQuery.removeEventListener('change', handleViewportChange);
		}

		mediaQuery.addListener(handleViewportChange);
		return () => mediaQuery.removeListener(handleViewportChange);
	}, []);

	useEffect(() => {
		if (isMobileViewport) {
			setShowSplash(false);
			setIsSplashLeaving(false);
			return;
		}

		setShowSplash(true);
		setIsSplashLeaving(false);

		const fadeTimer = setTimeout(() => setIsSplashLeaving(true), 900);
		const hideTimer = setTimeout(() => setShowSplash(false), 1300);

		return () => {
			clearTimeout(fadeTimer);
			clearTimeout(hideTimer);
		};
	}, [ isMobileViewport ]);

	return (
		<>
			{ showSplash && !isMobileViewport && <SplashScreen isLeaving={ isSplashLeaving } /> }
			<Head>
				<title>פרי וירק ארצנו - פירות וירקות טריים</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>

			<Layout cartItems={ cartItems } setCartItems={ setCartItems }>
				<Component { ...pageProps } cartItems={ cartItems } setCartItems={ setCartItems } />
			</Layout>

			{ globalStore.popupProduct && (
				<ProductPopup
					product={ globalStore.popupProduct }
					cartItems={ cartItems }
					setCartItems={ setCartItems }
				/>
			) }

			<Script src="https://cdn.enable.co.il/licenses/enable-L804575kdnhulif-0221-25262/init.js" strategy="lazyOnload" />
		</>
	);
}

export default observer(MyApp);