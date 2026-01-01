import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ProductShowcase from "../../components/ProductShowcase";
import InfiniteScroll from 'react-infinite-scroll-component';

const categoriesTitles = {
    1: 'ירקות',
    2: 'פירות',
    3: 'מעדנייה',
    4: 'ירק ופטריות',
    5: 'מזווה',
    6: 'יבשים',
    7: 'מבצעים',
    25: 'המיוחדים',
    28: 'מארזים'
}

const categoryMeta = {
    1: {
        eyebrow: 'חקלאות ישראלית',
        description: 'ירקות שנקטפו השבוע ממשקים מקומיים, עוברים מיון ידני ומגיעים אליכם כשהם בשיא הטריות.',
        highlights: [ 'ללא ריסוס עודף', 'קטיף בוקר' ]
    },
    2: {
        eyebrow: 'מתיקות טבעית',
        description: 'פירות מובחרים שנבחרו אחד אחד כדי לשמור על עסיסיות, טעם וריח של שוק פתוח.',
        highlights: [ 'מיון ידני', 'מגיע קר ומוכן לאכילה' ]
    },
    3: {
        eyebrow: 'טעמים מהדלי',
        description: 'גבינות, ממרחים ומעדני בית שנרקחים בקבוצות קטנות עם חומרי גלם טריים בלבד.',
        highlights: [ 'ייצור ביתי', 'כשר ופיקוח מלא' ]
    },
    28: {
        eyebrow: 'מארזים מיוחדים',
        description: 'חבילות מתנה ממותגות לאירועים, לקוחות עסקיים או פשוט כדי לפנק את המשפחה.',
        highlights: [ 'אפשרות למיתוג אישי', 'משלוח עד פתח הבית' ]
    }
};

const defaultCategoryMeta = {
    eyebrow: 'כל הטוב במקום אחד',
    description: 'תבחרו את הקטגוריה שמתאימה לכם ותנו לנו לדאוג לשאר – משלוח מהיר, שירות אישי וטריות שאפשר לראות.',
    highlights: [ 'משלוח עד הבית', 'תמיכה מלאה בוואטסאפ' ]
};

const CategoryLoader = () => (
    <div className="category-loader" role="status" aria-live="polite">
        <div className="category-loader-dots">
            <span className="category-loader-dot" />
            <span className="category-loader-dot" />
            <span className="category-loader-dot" />
        </div>
        <p className="category-loader-label">טוען מוצרים טריים...</p>
    </div>
);

const Category = ({ cartItems, setCartItems }) => {
    const router = useRouter();
    const { cid, subcategory } = router.query;

    const [ products, setProducts ] = useState([]);
	const [ curPage, setCurPage ] = useState(1);
	const [searchKeywords, setSearchKeywords] = useState("");
    const [ hasMore, setHasMore ] = useState(true);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [categorySubcategories, setCategorySubcategories] = useState([]);
    const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);

    const loadProducts = () => {
		if (pageLoaded) {
			let query = '&category_id=' + cid;

			if (searchKeywords.length) {
				query += `&search=${searchKeywords}`;
			}

            if (subcategory) {
                query += `&subcategory=${subcategory}`
            }

            axios.get(process.env.NEXT_PUBLIC_API_URL + "/products/?page=" + curPage + query).then((res) => {
            	if (curPage == 1) {
            		setProducts(res.data.products);
            	} else {
            		setProducts(products.concat(res.data.products));
            	}

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
	}, [searchKeywords, router.query]);

	useEffect(() => {
        loadProducts();
		setPageLoaded(true)
	}, [])

    useEffect(() => {
        if (!cid) {
            return;
        }

        setSubcategoriesLoading(true);
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subcategories/${cid}`)
            .then((res) => setCategorySubcategories(res.data || []))
            .catch(() => setCategorySubcategories([]))
            .finally(() => setSubcategoriesLoading(false));
    }, [cid]);

	const nextPage = () => {
		if (products.length > 15) {
			setCurPage(curPage + 1)
		}
	}

    const handleSubcategoryFilter = (nextSubcategory) => {
        if (!cid) {
            return;
        }

        const href = nextSubcategory
            ? `/category/${cid}/?subcategory=${encodeURIComponent(nextSubcategory)}`
            : `/category/${cid}`;

        if (nextSubcategory === subcategory || (!nextSubcategory && !subcategory)) {
            return;
        }

        router.push(href);
    };

    const resolvedTitle = subcategory || categoriesTitles[cid] || 'קטגוריה';
    const meta = categoryMeta[cid] || defaultCategoryMeta;
    const resultsLabel = products.length ? `${products.length} מוצרים זמינים ברשימה` : 'טרם נוספו מוצרים להצגה';
    const hasSubcategoryFilters = categorySubcategories.length > 0;

    return (
        <>
            <section className="category-hero">
                <img className="category-hero-media" src={ `/images/categories/${ cid }.jpeg` } alt={ resolvedTitle } />
                <div className="category-hero-overlay"></div>
                <div className="container category-hero-content">
                    <div className="category-hero-copy">
                        <h1>{ resolvedTitle }</h1>
                    </div>
                </div>
            </section>

            <section className="container category-content">
                <div id="home-main-content">
                    { hasSubcategoryFilters && (
                        <div className="subcategory-filter-card">
                            <div className="subcategory-filter-head">
                                { subcategory ? (
                                    <button type="button" className="subcategory-reset-btn" onClick={ () => handleSubcategoryFilter(null) }>
                                        ניקוי סינון
                                    </button>
                                ) : null }
                            </div>
                            { subcategoriesLoading ? (
                                <p className="subcategory-filter-loading">טוען תתי קטגוריות...</p>
                            ) : (
                                <div className="subcategory-filter-scroll">
                                    <button
                                        type="button"
                                        className={`subcategory-pill ${!subcategory ? 'active' : ''}`}
                                        onClick={ () => handleSubcategoryFilter(null) }
                                    >
                                        הכל
                                    </button>
                                    { categorySubcategories.map((item) => (
                                        <button
                                            type="button"
                                            key={ item._id || item.name }
                                            className={`subcategory-pill ${subcategory === item.name ? 'active' : ''}`}
                                            onClick={ () => handleSubcategoryFilter(item.name) }
                                        >
                                            { item.name }
                                        </button>
                                    )) }
                                </div>
                            ) }
                        </div>
                    ) }

                    <div className="category-search-header">
                        <div>
                            <span className="home-eyebrow subtle">חיפוש מהיר</span>
                            <h2>מצאו את { resolvedTitle } שאתם אוהבים</h2>
                        </div>
                        <span className="category-result-chip">{ resultsLabel }</span>
                    </div>

                    <form action="" id="products-search-form" className="category-search-form">
                        <span className="category-search-icon" aria-hidden="true">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm0-2C6.582 2 3 5.582 3 10s3.582 8 8 8a7.952 7.952 0 0 0 4.9-1.7l4.4 4.4 1.4-1.4-4.4-4.4A7.952 7.952 0 0 0 19 10c0-4.418-3.582-8-8-8z" fill="currentColor" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="חפש/י מוצרים, זנים או מותגים"
                            value={searchKeywords}
                            onChange={(e) => setSearchKeywords(e.target.value)}
                            id="product-search-input"
                            className="category-search-input"
                        />
                    </form>

                    { !products.length && <p id="no-products-found-p">לא נמצאו מוצרים התואמים את החיפוש.</p> }

                    <div className="category-products-card" id="main-products-list">
                        <InfiniteScroll
                            dataLength={products.length}
                            next={nextPage}
                            hasMore={hasMore}
                            loader={<CategoryLoader />}
                            endMessage={
                                <p style={{ textAlign: 'center' }}>
                                    <b>הגעת לסוף</b>
                                </p>
                            }
                        >
                            <div className="main-products-list">
                                { products && products.map((product) => (
                                    <ProductShowcase
                                        key={product._id}
                                        product={product}
                                        id={ product._id }
                                        description={ product.description }
                                        badge={ product.badge }
                                        cartItems={ cartItems }
                                        minAmount={ product.minAmount }
                                        setCartItems={ setCartItems }
                                        name={ product.name }
                                        salePrice={ product.salePrice }
                                        price={ product.price }
                                        priceKg={product.priceKg}
                                        salePriceKg={product.salePriceKg}
                                        unit={ product.unitType }
                                        numberId={ product.id }
                                        relatedProductsPool={ products }
                                    />
                                )) }
                            </div>
                        </InfiniteScroll>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Category;