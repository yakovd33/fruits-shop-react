import Slider from "../components/Home/slider";
import ProductShowcase from "../components/ProductShowcase";

export default function Home() {
	return (
		<>
			<Slider />

			<div className="container">
				<div id="home-main-content">
					<h2 id="our-products-title">המוצרים שלנו</h2>

					<div id="main-products-category-filters">
						<div className="main-product-category-filter active">הכל</div>
						<div className="main-product-category-filter">ירקות</div>
						<div className="main-product-category-filter">פירות</div>
						<div className="main-product-category-filter">מעדנייה</div>
						<div className="main-product-category-filter">ירק ופטריות</div>
						<div className="main-product-category-filter">מזווה</div>
						<div className="main-product-category-filter">יבשים</div>
						<div className="main-product-category-filter">מבצעים</div>
					</div>

					<div id="main-products-list">
						<ProductShowcase name="חמוציות מסוכרות" price="20" unit="ק''ג" image="/images/products/hamuziot.jpg"/>
						<ProductShowcase name="חמוציות מסוכרות" price="20" unit="ק''ג" image="/images/products/hamuziot.jpg"/>
						<ProductShowcase name="חמוציות מסוכרות" price="20" unit="ק''ג" image="/images/products/hamuziot.jpg"/>
						<ProductShowcase name="חמוציות מסוכרות" price="20" unit="ק''ג" image="/images/products/hamuziot.jpg"/>
						<ProductShowcase name="חמוציות מסוכרות" price="20" unit="ק''ג" image="/images/products/hamuziot.jpg"/>
						<ProductShowcase name="חמוציות מסוכרות" price="20" unit="ק''ג" image="/images/products/hamuziot.jpg"/>
						<ProductShowcase name="חמוציות מסוכרות" price="20" unit="ק''ג" image="/images/products/hamuziot.jpg"/>
						<ProductShowcase name="חמוציות מסוכרות" price="20" unit="ק''ג" image="/images/products/hamuziot.jpg"/>
					</div>

					<div id="home-pagination">
						<div className="pagination-item">1</div>
						<div className="pagination-item active">2</div>
						<div className="pagination-item">3</div>
						<div className="pagination-item">4</div>
					</div>
				</div>
			</div>
		</>
	);
}
