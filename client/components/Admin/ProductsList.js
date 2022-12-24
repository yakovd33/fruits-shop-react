import React, { useState, useEffect } from 'react';
import ProductListItem from './ProductListItem';
import axios from 'axios';

const ProductsList = ({ tab }) => {
    const [ products, setProducts ] = useState([]);
    const [ keywords, setKeywords ] = useState('')

    useEffect(() => {
        let query = ``;
        if (keywords.length) {
            query += `&search=${keywords}`;
        }

        axios.get(`${process.env.API_URL}/products?limit=100${query}`).then((res) => {
            setProducts(res.data.products);
        });
    }, [ keywords ]);

    return (
        <div id="admin-products-list">
            <input type="text" onChange={(e) => setKeywords(e.target.value)} placeholder="חיפוש מוצרים" id="product-search-admin"/>
            { (products || []).map((product) => (
                <ProductListItem id={ product.id } product={ product } products={ products } setProducts={ setProducts }/>
            )) }
        </div>
     );
}
 
export default ProductsList;