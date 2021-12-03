import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ProductShowcase from "../../components/ProductShowcase";

const Category = ({ cartItems, setCartItems }) => {
    const router = useRouter();
    const { cid } = router.query;

    const [ products, setProducts ] = useState([]);
    const [ totalLength, setTotalLength ] = useState(0);
	const [ curPage, setCurPage ] = useState(1);
	const [ totalPages, setTotalPages ] = useState(1);
	const [searchKeywords, setSearchKeywords] = useState("");

	const loadProducts = (cid) => {
		let category_query = '&category=' + cid;

        if (searchKeywords.length) {
			category_query += `&search=${searchKeywords}`;
		}
		
		axios.get(process.env.API_URL + '/products/?page=' + curPage + category_query).then((res) => {
			setProducts(res.data.products);
			setTotalLength(res.data.length);
			setTotalPages(Math.ceil(res.data.length / 20));
		});
	}

	useEffect(() => {
        if (router != undefined && router.query != undefined && router.query.cid != undefined) {
            console.log(router.query.cid);
		    loadProducts(router.query.cid);
        }
	}, [ curPage, router.query, searchKeywords ]);

    return ( <>
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

                <div id="main-products-list">
                    { products && products.map((product) => (
                        <ProductShowcase cartItems={ cartItems } setCartItems={ setCartItems } name={ product.name } salePrice={ product.salePrice } price={ product.price } unit={ product.unitType } image={ `${ process.env.API_URL }/image/${ product.id }.jpg ` }/>
                    )) }
                </div>

                <div id="home-pagination">
                    { [...Array(totalPages)].map((_, index) => <div className={ `pagination-item ${index + 1 == curPage ? 'active' : ''}` } onClick={ () => setCurPage(index + 1) }>{ index + 1 }</div>) }
                </div>
            </div>
        </div>
    </> );
}
 
export default Category;