import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductShowcase from "../components/ProductShowcase";
import InfiniteScroll from 'react-infinite-scroll-component';
import ProductStrip from "../components/ProductStrip";
import OrchardCategories from "../components/OrchardCategories";
import { AiOutlineArrowLeft } from 'react-icons/ai';
import "react-multi-carousel/lib/styles.css";

const heroSlides = [
	{
		id: 'orchard-dreams',
		tagline: 'חגיגת טריות',
		headline: 'שוק פירות יומי\nעד הבית',
		description: 'ארגזי אננס, מנגו וענבים שנקטפים במושב ומגיעים במשלוח ישיר, כשהם עטופים באריזת קירור קלילה. כל פרי נבחר ידנית ומגיע מצונן עד הדלת עם הבטחת טריות ל-48 שעות.',
		ctaLabel: 'הוסיפו לעגלה',
		floatingSummary: '15 זנים מובחרים',
		image: '/images/hero-banners/1.png',
		imageAlt: 'תצוגת פירות צבעונית על רקע ירקרק'
	},
	{
		id: 'green-crate',
		tagline: 'מהחקלאי לסיר',
		headline: 'סל ירקות שמדליק\nאת המטבח',
		description: 'שילובי חסות, בזיליקום ופטריות פורטובלו לסלטים וסטיר פריי זריזים, יחד עם תבליני בית שמגיעים בערכה אישית. הסל כולל רעיונות מתכונים מודפסים כדי שתדעו בדיוק מה להכין בכל ערב.',
		ctaLabel: 'לגלות את הסל',
		floatingSummary: '10 רעיונות לשייקים',
		image: '/images/hero-banners/2.png',
		imageAlt: 'ירקות טריים על רקע בהיר'
	},
	{
		id: 'sunny-gift',
		tagline: 'לרגעים מתוקים',
		headline: 'מארזי בריאות\nשמגיעים בחיוך',
		description: 'מתנות של קיווי, ליצ׳י ופסיפלורה מקוררות בדרך אל מי שאתם אוהבים, עם אפשרות לצרף כרטיס ברכה אישי ושוקולדים ללא סוכר. כל המארזים נארזים בריא ונשלחים עם שליח שמעדכן בזמן אמת.',
		ctaLabel: 'בחרו מארז',
		floatingSummary: 'משלוח תוך שעתיים',
		image: '/images/hero-banners/3.png',
		imageAlt: 'מארז מתנה עם פירות טרופיים'
	}
];

const orchardHighlights = {
	leftColumn: [
		{
			id: 'forest-mushrooms',
			badge: 'שף ממליץ',
			title: 'ירוקים זה החיים',
			description: 'מבחר ירוקים ועלים טריים לבישול וסלטים.',
			image: '/images/categories/6.jpeg',
			accent: 'rgba(160, 120, 95, 0.38)',
			media: {
				src: '/images/orchard/items-media/1.png',
				alt: 'צלוחית פטריות צלויות',
				style: {
					width: '95%',
					right: '-8%',
					top: 0,
					// clipPath: 'polygon(0 0, 100% 0, 100% 82.5%, 0 82.5%)',
					objectPosition: 'top',
					height: '100%'
				}
			}
		},
		{
			id: 'root-colors',
			badge: 'שוק הצבעים',
			title: 'פטריות או לא להיות',
			description: 'מבחר פטריות טריות לבישול ומנות גורמה.',
			image: '/images/categories/2.png',
			accent: 'rgba(232, 116, 74, 0.35)',
			media: {
				src: '/images/orchard/items-media/2.png',
				alt: 'ירקות שורש צבעוניים',
				style: {
					width: '91%',
					left: '17%',
					bottom: '-31%',
					objectFit: 'contain'
				}
			}
		},
		{
			id: 'leafy-delight',
			badge: 'מומלץ לתזונה',
			title: 'המעדנייה',
			description: 'מוצרי מעדנייה איכותיים לכריכים ובישול.',
			image: '/images/categories/28.jpeg',
			accent: 'rgba(146, 186, 78, 0.35)',
			media: {
				src: '/images/orchard/items-media/3.png',
				alt: 'מיקס עלים ירוקים טריים',
				style: {
					width: '87%',
					left: '-17px',
					bottom: '-10%',
					objectFit: 'contain',
					objectPosition: 'bottom'
				}
			}
		}
	],
	rightColumn: {
		feature: {
			id: 'warm-basket',
			badge: 'עונה עכשיו',
			title: 'פירות העונה',
			description: 'מבחר פירות טריים, עסיסיים, צבעוניים ומלאי טעם.',
			image: '/ges/orchard/items-media/4.png',
			accent: 'rgba(205, 121, 60, 0.45)',
			media: {
				src: '/images/orchard/items-media/4.png',
				alt: 'סל ירקות חורף',
				style: {
					width: '87%',
					left: '-17px',
					bottom: '-10%',
					objectFit: 'contain',
					objectPosition: 'bottom'
				}
			}
		},
		secondary: [
			{
				id: 'herb-garden',
				badge: 'עלי תיבול',
				title: 'המאפייה',
				description: 'מאפים ולחמים טריים שנאפים מדי יום.',
				image: '/images/categories/4.jpeg',
				accent: 'rgba(76, 165, 86, 0.4)',
				media: {
					src: '/images/orchard/items-media/5.png',
					alt: 'אוסף עשבי תיבול',
					style: {
						width: '92%',
						left: '-6%',
						bottom: '-6%'
					}
				}
			},
			{
				id: 'japanese-greens',
				badge: 'חדש',
				title: 'המארזים שלנו',
				description: 'מארזים מוכנים ומעוצבים, מתאימים לכל אירוע וחג.',
				image: '/images/categories/2.jpeg',
				accent: 'rgba(93, 153, 107, 0.35)',
				media: {
					src: '/images/orchard/items-media/6.png',
					alt: 'עלי בייבי מאסיה',
					style: {
						width: '92%',
						left: '-32%',
						bottom: '-10%',
						objectFit: 'contain'
					}
				}
			}
		]
	}
};

const orchardBannerHighlight = {
	image: '/images/orchard/orchard-banners/1.png',
	alt: 'סטיילינג עונתי על קרש עץ',
	eyebrow: 'תצוגת השוק שלנו',
	title: 'הלוח שמאחד את כל הטעמים',
	description: 'ריכזנו סל השראה שמתעדכן בכל מוצאי שבת עם שפע של שילובים, מתכונים קטנים וטיפים לסידור המוצרים במטבח.',
	ctaLabel: 'פתחו את הלוח'
};

const orchardHeadingCopy = {
	title: 'הקטגוריות שלנו',
	description: 'נבחרת קטגוריות קבועה שמתעדכנת פעם בשבועיים ומסדרת לכם את הסל לפי מצב רוח, טעם וסגנון הגשה.',
	ctaLabel: 'כל הקטגוריות'
};

const fallbackGalleryColors = ['#f8c5d0', '#fee1a6', '#c9f3f7'];

const HeroHeadline = ({ text = '' }) => (
	<>
		{ text.split('\n').map((line, index) => (
			<span key={`${line}-${index}`} className="hero-headline-line">{ line }</span>
		)) }
	</>
);

const HeroFloatingGallery = ({ items = [] }) => {
	if (!items.length) {
		return (
			<div className="hero-floating-gallery">
				{ fallbackGalleryColors.map((color) => (
					<span key={ color } style={{ backgroundColor: color }}></span>
				)) }
			</div>
		);
	}

	return (
		<div className="hero-floating-gallery">
			{ items.map((item, index) => (
				<span
					key={ item?._id || item?.id || index }
					style={{ backgroundImage: item?.url ? `url(${ item.url })` : undefined }}
				></span>
			)) }
		</div>
	);
};

const categoryFilters = [
	{ label: 'כל המוצרים', value: 'all' },
	{ label: 'ירקות', value: 1 },
	{ label: 'פירות', value: 2 },
	{ label: 'מעדנייה', value: 3 },
	{ label: 'ירק ופטריות', value: 4 },
	{ label: 'מזווה', value: 5 },
	{ label: 'יבשים', value: 6 },
	{ label: 'מארזים', value: 28 },
	{ label: 'המיוחדים', value: 25 },
	{ label: 'מבצעים', value: 7 }
];

const LoadMoreIndicator = () => (
	<div className="load-more-indicator">
		<div className="load-more-spinner" aria-hidden="true">
			<span></span>
			<span></span>
			<span></span>
		</div>
		<div className="load-more-copy">
			<strong>טוענים עוד מוצרים טריים...</strong>
			<span>רק רגע, אנחנו מוסיפים עוד פריטים לעגלה.</span>
		</div>
	</div>
);

const CategoryFilters = ({ category, setCategory, wrapperClassName = '' }) => (
	<div className={`filter-scroll ${wrapperClassName}`.trim()}>
		<div id="main-products-category-filters">
			{ categoryFilters.map((option) => (
				<div
					key={ option.value }
					className={`main-product-category-filter ${category === option.value ? 'active' : ''}`}
					onClick={ () => setCategory(option.value) }
				>
					{ option.label }
				</div>
			)) }
		</div>
	</div>
);

const MobileHome = ({
	heroContent,
	heroGallery,
	cartItems,
	setCartItems,
	weeklyProducts,
	hotProducts,
	category,
	setCategory,
	searchKeywords,
	setSearchKeywords,
	products,
	hasMore,
	nextPage,
	orchardBanner,
	orchardLeftColumn = [],
	orchardRightFeature,
	orchardRightSecondary = [],
	onOrchardCta = () => {},
	orchardHeadingTitle,
	orchardHeadingDescription,
	orchardCtaLabel
}) => {
	const fallbackHeroContent = heroSlides[0] || {};
	const {
		headline = '',
		description = '',
		tagline = '',
		ctaLabel = '',
		floatingSummary = '',
		image = '',
		imageAlt = ''
	} = heroContent || fallbackHeroContent;

	return (
		<main className="mobile-home">
			<section className="hero-shell hero-simple mobile-hero">
				<div className="mobile-hero-card">
					<span className="hero-tagline">{ tagline }</span>
					<h1><HeroHeadline text={ headline } /></h1>
					<p>{ description }</p>
					<a href="#mobile-products" className="hero-main-cta">
						<span>{ ctaLabel }</span>
						<span className="icon"><AiOutlineArrowLeft /></span>
					</a>
					<div className="hero-visual">
						<div className="hero-visual-blob">
							<img src={ image } alt={ imageAlt } />
						</div>
						<div className="hero-floating-card compact">
							<span className="hero-floating-eyebrow">{ tagline }</span>
							<HeroFloatingGallery items={ heroGallery } />
							<div className="hero-floating-count">{ floatingSummary }</div>
							<button type="button" className="hero-floating-link">
								<span>ראו עוד</span>
								<AiOutlineArrowLeft />
							</button>
						</div>
					</div>
				</div>
			</section>

			{ weeklyProducts?.length ? (
				<section className="mobile-section" id="mobile-deals">
					<ProductStrip
						cartItems={ cartItems }
						setCartItems={ setCartItems }
						title="בחרו את ההטבה שלכם"
						products={ weeklyProducts }
					/>
				</section>
			) : null }

			{ hotProducts?.length ? (
				<section className="mobile-section" id="mobile-hot">
					<ProductStrip
						cartItems={ cartItems }
						setCartItems={ setCartItems }
						title="מה כולם מזמינים"
						products={ hotProducts }
					/>
				</section>
			) : null }

			<OrchardCategories
				sectionClassName="mobile-section orchard-mobile-section"
				banner={ orchardBanner }
				leftColumn={ orchardLeftColumn }
				rightFeature={ orchardRightFeature }
				rightSecondary={ orchardRightSecondary }
				headingTitle={ orchardHeadingTitle }
				headingDescription={ orchardHeadingDescription }
				ctaLabel={ orchardCtaLabel }
				onCtaClick={ onOrchardCta }
			/>

			<section className="mobile-section mobile-products" id="mobile-products">
				<div className="mobile-section-header">
					<span className="home-eyebrow subtle">התאימו את הסל שלכם</span>
					<h2>המוצרים שלנו</h2>
				</div>
				<CategoryFilters
					category={ category }
					setCategory={ setCategory }
					wrapperClassName="mobile-filter-scroll"
				/>
				<div className="mobile-products-search">
					<input
						type="text"
						placeholder="חיפוש מהיר..."
						value={ searchKeywords }
						onChange={ (event) => setSearchKeywords(event.target.value) }
					/>
				</div>
				<div className="mobile-products-list">
					<InfiniteScroll
						dataLength={ products.length }
						next={ nextPage }
						hasMore={ hasMore }
						loader={<LoadMoreIndicator/>}
						endMessage={<p className="mobile-end-of-list"><b>הגעתם לסוף הרשימה</b></p>}
					>
						<div className="main-products-list">
							{ (products || []).map((product) => (
								<ProductShowcase
									key={ product._id || product.id }
									product={ product }
									id={ product._id }
									cartItems={ cartItems }
									minAmount={ product.minAmount }
									setCartItems={ setCartItems }
									description={ product.description }
									name={ product.name }
									price={ product.price }
									salePrice={ product.salePrice }
									priceKg={ product.priceKg }
									salePriceKg={ product.salePriceKg }
									unit={ product.unitType }
									badge={ product.badge }
									numberId={ product.id }
									relatedProductsPool={ products }
								/>
							)) }
						</div>
					</InfiniteScroll>
				</div>
			</section>
		</main>
	);
};

export default function Home({ cartItems, setCartItems, weeklyProducts, hotProducts, allProducts, slides }) {
	const [products, setProducts] = useState(allProducts || []);

	const [ hasMore, setHasMore ] = useState(true);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [totalLength, setTotalLength] = useState(0);
	const [curPage, setCurPage] = useState(1);
	const [category, setCategory] = useState("all");
	const [searchKeywords, setSearchKeywords] = useState('');
	const [isMobile, setIsMobile] = useState(false);
	const [activeHeroIndex, setActiveHeroIndex] = useState(0);

	const loadProducts = () => {
		if (pageLoaded) {
			let query = "";
			if (category != "all") {
				query = "&category_id=" + category;
			}

			if (searchKeywords.length) {
				query += `&search=${searchKeywords}`;
			}

			axios.get(process.env.NEXT_PUBLIC_API_URL + "/products/?page=" + curPage + query).then((res) => {
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

	useEffect(() => {
		const updateViewport = () => {
			const mobileView = window.innerWidth <= 768;
			setIsMobile((prev) => (prev === mobileView ? prev : mobileView));
		};

		updateViewport();
		window.addEventListener('resize', updateViewport);

		return () => window.removeEventListener('resize', updateViewport);
	}, []);

	useEffect(() => {
		if (heroSlides.length <= 1) {
			return;
		}

		const timer = setInterval(() => {
			setActiveHeroIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
		}, 5000);

		return () => clearInterval(timer);
	}, []);

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

	const activeHero = heroSlides[activeHeroIndex] || heroSlides[0] || {};
	const heroGalleryFromApi = (slides || []).slice(0, 4);
	const heroGallery = (activeHero?.gallery && activeHero.gallery.length) ? activeHero.gallery : heroGalleryFromApi;
	const {
		tagline,
		headline,
		description,
		ctaLabel,
		floatingSummary,
		image,
		imageAlt
	} = activeHero;

	const orchardLeftColumn = orchardHighlights.leftColumn || [];
	const orchardRightFeature = orchardHighlights.rightColumn?.feature;
	const orchardRightSecondary = orchardHighlights.rightColumn?.secondary || [];

	const scrollToSection = (targetId = 'our-products-title') => {
		if (typeof document === 'undefined' || !targetId) {
			return;
		}
		document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	if (isMobile) {
		return (
			<MobileHome
				heroContent={ activeHero }
				heroGallery={ heroGallery }
				cartItems={ cartItems }
				setCartItems={ setCartItems }
				weeklyProducts={ weeklyProducts }
				hotProducts={ hotProducts }
				category={ category }
				setCategory={ setCategory }
				searchKeywords={ searchKeywords }
				setSearchKeywords={ setSearchKeywords }
				products={ products }
				hasMore={ hasMore }
				nextPage={ nextPage }
				orchardBanner={ orchardBannerHighlight }
				orchardLeftColumn={ orchardLeftColumn }
				orchardRightFeature={ orchardRightFeature }
				orchardRightSecondary={ orchardRightSecondary }
				onOrchardCta={ () => scrollToSection('mobile-products') }
				orchardHeadingTitle={ orchardHeadingCopy.title }
				orchardHeadingDescription={ orchardHeadingCopy.description }
				orchardCtaLabel={ orchardHeadingCopy.ctaLabel }
			/>
		);
	}

	return (
		<>
			<section className="hero-shell hero-simple">
				<div className="container hero-simple-grid">
					<div className="hero-copy hero-simple-copy">
						<span className="hero-tagline">{ tagline }</span>
						<h1><HeroHeadline text={ headline } /></h1>
						<p>{ description }</p>
						<a href="#our-products-title" className="hero-main-cta">
							<span>{ ctaLabel }</span>
							<span className="icon"><AiOutlineArrowLeft /></span>
						</a>
					</div>
					<div className="hero-visual">
						<div className="hero-visual-blob">
							<img src={ image } alt={ imageAlt } />
						</div>
						<div className="hero-floating-card">
							<span className="hero-floating-eyebrow">{ tagline }</span>
							<HeroFloatingGallery items={ heroGallery } />
							<div className="hero-floating-count">{ floatingSummary }</div>
							<button type="button" className="hero-floating-link">
								<span>ראו עוד</span>
								<AiOutlineArrowLeft />
							</button>
						</div>
					</div>
				</div>
			</section>

			<div className="container">
				<div id="home-main-content">
					<section className="home-section accent" id="weekly-deals">
						<ProductStrip
							cartItems={cartItems}
							setCartItems={setCartItems}
							title="מבצעי השבוע"
							products={weeklyProducts}
						/>
					</section>

					<section className="home-section warm">
						<ProductStrip
							cartItems={cartItems}
							setCartItems={setCartItems}
							title="מוצרים חמים"
							products={hotProducts}
						/>
					</section>

					<OrchardCategories
						sectionClassName="home-section"
						banner={ orchardBannerHighlight }
						leftColumn={ orchardLeftColumn }
						rightFeature={ orchardRightFeature }
						rightSecondary={ orchardRightSecondary }
						headingTitle={ orchardHeadingCopy.title }
						headingDescription={ orchardHeadingCopy.description }
						ctaLabel={ orchardHeadingCopy.ctaLabel }
						onCtaClick={ () => scrollToSection('our-products-title') }
					/>

					<section className="home-section surface">
						<div className="section-heading">
							<div>
								<span className="home-eyebrow subtle">בחרו לפי טעם וסגנון</span>
								<h2 id="our-products-title">המוצרים שלנו</h2>
							</div>
						</div>

						<CategoryFilters category={ category } setCategory={ setCategory } />

						<div className="products-search-card">
							<form action="" id="products-search-form">
								<input
									type="text"
									placeholder="חפש/י מוצרים"
									value={searchKeywords}
									onChange={(e) => setSearchKeywords(e.target.value)}
									id="product-search-input"
								/>
							</form>
						</div>

						<div className="products-grid-card">
							<InfiniteScroll
								dataLength={products.length}
								next={nextPage}
								hasMore={hasMore}
								loader={<LoadMoreIndicator />}
								endMessage={
									<p style={{ textAlign: 'center' }}>
									<b>הגעת לסוף</b>
									</p>
								}>
									<div className="main-products-list">
										{ (products || []).map((product) => (
											<ProductShowcase
												product={product}
												id={ product._id }
												cartItems={cartItems}
												minAmount={ product.minAmount }
												setCartItems={setCartItems}
												description={ product.description }
												name={product.name}
												price={product.price}
												salePrice={product.salePrice}
												priceKg={product.priceKg}
												salePriceKg={product.salePriceKg}
												unit={product.unitType}
												badge={ product.badge }
												numberId={ product.id }
												relatedProductsPool={ products }
											/>
										))}
									</div>
								</InfiniteScroll>
						</div>
					</section>
				</div>
			</div>
		</>
	);
}

export async function getStaticProps(context) {
	const { data: weeklyData } = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/products/?isRecommended=true");
	const { data: hotData } = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/products/?isHomepage=true");
	const { data: allData } = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/products/?page=1");
	const { data: slidesData } = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/slides");

	return {
	  props: {
		weeklyProducts: weeklyData?.products,
		hotProducts: hotData?.products,
		allProducts: allData?.products,
		slides: slidesData,
	  },
	  revalidate: 5
	}
}