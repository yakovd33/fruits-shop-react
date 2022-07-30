import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ProductShowcase from "../../components/ProductShowcase";
import InfiniteScroll from 'react-infinite-scroll-component';

const categoriesTitles = [
    'ירקות',
    'פירות',
    'מעדנייה',
    'ירק ופטריות',
    'מזווה',
    'יבשים',
    'מבצעים',
]

const Category = ({ cartItems, setCartItems }) => {
    const router = useRouter();
    const { cid, subcategory } = router.query;

    const [ products, setProducts ] = useState([]);
	const [ curPage, setCurPage ] = useState(1);
	const [searchKeywords, setSearchKeywords] = useState("");
    const [ hasMore, setHasMore ] = useState(true);
    const [pageLoaded, setPageLoaded] = useState(false);

    const loadProducts = () => {
		if (pageLoaded) {
			let query = '&category_id=' + cid;

			if (searchKeywords.length) {
				query += `&search=${searchKeywords}`;
			}

            if (subcategory) {
                query += `&subcategory=${subcategory}`
            }

            axios.get(process.env.API_URL + "/products/?page=" + curPage + query).then((res) => {
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
		setPageLoaded(true)
	}, [])

	const nextPage = () => {
		if (products.length > 15) {
			setCurPage(curPage + 1)
		}
	}

    return ( <>
        <div id="category-hero-wrap">
            <div id="category-hero-title">{ subcategory || categoriesTitles[cid - 1] }</div>
            <img src={ `/images/categories/${ cid }.jpeg` }/>
        </div>

        <div className="container">
            <div id="home-main-content">
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
                                    { products && products.map((product) => (
                                        <ProductShowcase id={ product._id } description={ product.description } badge={ product.badge } cartItems={ cartItems } minAmount={ product.minAmount } setCartItems={ setCartItems } name={ product.name } salePrice={ product.salePrice } price={ product.price } unit={ product.unitType } image={ `https://eropa.co.il/fruits/uploads/${ product.id }.jpg ` }/>
                                    )) }
                                </div>
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    </> );
}
 
export default Category;