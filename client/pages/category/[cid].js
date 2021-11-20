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
	const [ category, setCategory ] = useState('all');

	const loadProducts = (cid) => {
        console.log(cid);
		let category_query = '&category=' + cid;
		
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
	}, [ curPage, router.query ]);

    return ( <>
        <div className="container">
            <div id="home-main-content">
                <div id="main-products-list">
                    { products && products.map((product) => (
                        <ProductShowcase cartItems={ cartItems } setCartItems={ setCartItems } name={ product.name } price={ product.price } unit={ product.unitType } image={ `${ process.env.API_URL }/image/${ product.id }.jpg ` }/>
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