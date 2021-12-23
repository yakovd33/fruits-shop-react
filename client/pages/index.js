import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "../components/Home/Slider";
import ProductShowcase from "../components/ProductShowcase";

export default function Home({ cartItems, setCartItems }) {
	const [products, setProducts] = useState([
		{
			id: "0208821d-fe14-4bc0-b6c5-033419301738",
			name: "יין טנא - קברנה סוביניון 2019",
			minAmount: "1",
			availability: true,
			category: 5,
			unitType: "יחידה",
			price: "65",
		},
		{
			unitType: "יחידה",
			availability: true,
			minAmount: "1",
			name: "חמציץ (מארז 200 גר')",
			id: "021f25e3-aaf9-4f4e-8769-21d115829b79",
			price: "18",
			category: 4,
			salePrice: 0
		},
		{
			minAmount: "1",
			price: "6",
			availability: true,
			category: 4,
			id: "02357c36-332e-4e82-a3bc-de0528d0293c",
			unitType: "יחידה",
			name: "רשד\\שיבה (צרור)",
			salePrice: 0
		},
		{
			category: 4,
			availability: true,
			id: "0267b34a-f911-4047-ba50-38453feff136",
			minAmount: "1",
			name: "מלוחייה (מארז 200 גר')",
			price: "11",
			unitType: "יחידה",
			salePrice: 0
		},
		{
			name: "חמוציות מסוכרות (קופסא 200 גר')",
			id: "034596bc-2a24-436b-90f7-57c0f2e20ac0",
			price: "14",
			category: 6,
			minAmount: "1",
			availability: true,
			unitType: "יחידה",
			salePrice: 0
		},
		{
			name: "ריבת קיווי איכותית (בוסטן 350 גר')",
			category: 5,
			availability: true,
			id: "034d9604-4117-4ba2-baa3-9c9e0e690e22",
			unitType: "יחידה",
			price: "35",
			minAmount: "1",
			salePrice: 0
		},
		{
			category: 6,
			minAmount: "1",
			unitType: "יחידה",
			price: "15",
			name: "הל (100 גר')",
			id: "05447ba7-6d5d-46d4-944a-5f31378d2bd5",
			availability: true,
			salePrice: 0
		},
		{
			minAmount: "1",
			id: "06e5857d-89e3-4f14-9592-67da2d973557",
			availability: true,
			unitType: "יחידה",
			category: 5,
			name: 'דבש - הדרים (למדני 1 ק"ג)',
			price: "50",
			salePrice: 0
		},
	]);

	const [totalLength, setTotalLength] = useState(0);
	const [curPage, setCurPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [category, setCategory] = useState("all");
	const [searchKeywords, setSearchKeywords] = useState("");

	const loadProducts = () => {
		let query = "";
		if (category != "all") {
			query = "&category=" + category;
		}

		if (searchKeywords.length) {
			query += `&search=${searchKeywords}`;
		}

		axios
			.get(process.env.API_URL + "/products/?page=" + curPage + query)
			.then((res) => {
				setProducts(res.data.products);
				setTotalLength(res.data.length);
				setTotalPages(Math.ceil(res.data.length / 20));
			});
	};

	useEffect(() => {
		loadProducts();
	}, [curPage]);

	useEffect(() => {
		setCurPage(1);
		loadProducts();
	}, [category, searchKeywords]);

	useEffect(() => {
        // Scroll to top when page changes
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
         });
    }, [ curPage ])

	return (
		<>
			<Slider />

			<div className="container">
				<div id="home-main-content">
					<h2 id="our-products-title">המוצרים שלנו</h2>

					<div id="main-products-category-filters">
						<div
							className={`main-product-category-filter ${
								category == "all" ? "active" : ""
							}`}
							onClick={() => setCategory("all")}
						>
							הכל
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

					{ !products.length && <p id="no-products-found-p">לא נמצאו מוצרים התואמים את החיפוש.</p> }

					<div id="main-products-list">
						{products &&
							products.map((product) => (
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
									image={`https://eropa.co.il/fruits/uploads/${product.id}.jpg `}
								/>
							))}
					</div>

					<div id="home-pagination">
						{[...Array(totalPages)].map((_, index) => (
							<div
								className={`pagination-item ${
									index + 1 == curPage ? "active" : ""
								} ${
									index < curPage - 4 || index > curPage + 2
										? "hide"
										: ""
								}`}
								onClick={() => setCurPage(index + 1)}
							>
								{index + 1}
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
