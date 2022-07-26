import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "../components/Home/Slider";
import ProductShowcase from "../components/ProductShowcase";
import InfiniteScroll from 'react-infinite-scroll-component';


export default function Home({ cartItems, setCartItems, weeklyProducts, hotProducts, allProducts }) {
	const [products, setProducts] = useState(allProducts || []);

	const [ hasMore, setHasMore ] = useState(true);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [totalLength, setTotalLength] = useState(0);
	const [curPage, setCurPage] = useState(1);
	const [category, setCategory] = useState("all");
	const [searchKeywords, setSearchKeywords] = useState('');

	const loadProducts = () => {
		if (pageLoaded) {
			let query = "";
			if (category != "all") {
				query = "&category=" + category;
			}

			if (searchKeywords.length) {
				query += `&search=${searchKeywords}`;
			}

			axios.get(process.env.API_URL + "/products/?page=" + curPage + query).then((res) => {
				if (curPage == 1) {
					setProducts(res.data.products);
				} else {
					setProducts(products.concat(res.data.products));
				}

				setTotalLength(res.data.length);

				if (!res.data.products.length) {
					setHasMore(false);
				}
			});
		}
	};

	useEffect(() => {
		if (pageLoaded) {
			loadProducts();
		}
	}, [curPage]);

	useEffect(() => {
		if (pageLoaded) {
			setProducts([]);
			setCurPage(1);
			setHasMore(true);
			loadProducts();
		}
	}, [category, searchKeywords]);

	useEffect(() => {
		setPageLoaded(true)
	}, [])

	const nextPage = () => {
		if (products.length > 15) {
			setCurPage(curPage + 1)
		}
	}

	// useEffect(() => {
    //     // Scroll to top when page changes
    //     window.scroll({
    //         top: 0,
    //         left: 0,
    //         behavior: 'smooth'
    //      });
    // }, [ curPage ])

	return (
		<>
			<Slider />

			<div className="container">
				<div id="home-main-content">
					<h2 className="homepage-section-title">מומלצי השבוע</h2>
					<div className="main-products-list sec">
						{ (weeklyProducts || []).map((product) => (
							<ProductShowcase
								id={ product._id }
								cartItems={cartItems}
								minAmount={ product.minAmount }
								setCartItems={setCartItems}
								description={ product.description }
								name={product.name}
								price={product.price}
								salePrice={product.salePrice}
								unit={product.unitType}
								badge={ product.badge }
								image={`https://eropa.co.il/fruits/uploads/${product.id}.jpg `}
							/>
						))}
					</div>

					<h2 className="homepage-section-title">מוצרים חמים</h2>
					<div className="main-products-list sec">
						{ (hotProducts || []).map((product) => (
							<ProductShowcase
								id={ product._id }
								cartItems={cartItems}
								minAmount={ product.minAmount }
								setCartItems={setCartItems}
								description={ product.description }
								name={product.name}
								price={product.price}
								salePrice={product.salePrice}
								unit={product.unitType}
								badge={ product.badge }
								image={`https://eropa.co.il/fruits/uploads/${product.id}.jpg `}
							/>
						))}
					</div>

					<h2 id="our-products-title">המוצרים שלנו</h2>

					<div id="main-products-category-filters">
						<div
							className={`main-product-category-filter ${
								category == "all" ? "active" : ""
							}`}
							onClick={() => setCategory("all")}
						>
							כל המוצרים
						</div>

						<div
							className={`main-product-category-filter ${
								category == 1 ? "active" : ""
							}`}
							onClick={() => setCategory(1)}
						>
							ירקות
						</div>
						<div
							className={`main-product-category-filter ${
								category == 2 ? "active" : ""
							}`}
							onClick={() => setCategory(2)}
						>
							פירות
						</div>
						<div
							className={`main-product-category-filter ${
								category == 3 ? "active" : ""
							}`}
							onClick={() => setCategory(3)}
						>
							מעדנייה
						</div>
						<div
							className={`main-product-category-filter ${
								category == 4 ? "active" : ""
							}`}
							onClick={() => setCategory(4)}
						>
							ירק ופטריות
						</div>
						<div
							className={`main-product-category-filter ${
								category == 5 ? "active" : ""
							}`}
							onClick={() => setCategory(5)}
						>
							מזווה
						</div>
						<div
							className={`main-product-category-filter ${
								category == 6 ? "active" : ""
							}`}
							onClick={() => setCategory(6)}
						>
							יבשים
						</div>
						<div
							className={`main-product-category-filter ${
								category == 7 ? "active" : ""
							}`}
							onClick={() => setCategory(7)}
						>
							מבצעים
						</div>
					</div>

					<form action="" id="products-search-form">
						<input
							type="text"
							placeholder="חפש/י מוצרים"
							value={searchKeywords}
							onChange={(e) => setSearchKeywords(e.target.value)}
							id="product-search-input"
						/>
					</form>

					<InfiniteScroll
						dataLength={products.length}
						next={nextPage}
						hasMore={hasMore}
						loader={<h4>טוען מוצרים...</h4>}
						endMessage={
							<p style={{ textAlign: 'center' }}>
							<b>הגעת לסוף</b>
							</p>
						}>
							<div className="main-products-list">
								{ (products || []).map((product) => (
									<ProductShowcase
										id={ product._id }
										cartItems={cartItems}
										minAmount={ product.minAmount }
										setCartItems={setCartItems}
										description={ product.description }
										name={product.name}
										price={product.price}
										salePrice={product.salePrice}
										unit={product.unitType}
										badge={ product.badge }
										image={`https://eropa.co.il/fruits/uploads/${product.id}.jpg `}
									/>
								))}
							</div>
					</InfiniteScroll>
				</div>
			</div>
		</>
	);
}

export async function getStaticProps(context) {
	const { data: weeklyData } = await axios.get(process.env.API_URL + "/products/?isRecommended=true");
	const { data: hotData } = await axios.get(process.env.API_URL + "/products/?isHomepage=true");
	const { data: allData } = await axios.get(process.env.API_URL + "/products/?page=1");

	return {
	  props: {
		weeklyProducts: weeklyData?.products,
		hotProducts: hotData?.products,
		allProducts: allData?.products
	  },
	  revalidate: 10
	}
}