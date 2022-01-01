import React, { useState, useEffect } from 'react';
import ProductListItem from './ProductListItem';
import axios from 'axios';

const ProductsList = ({ tab }) => {
    const [ products, setProducts ] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.API_URL}/products?all=true`).then((res) => {
            setProducts(res.data.products);
        });
    }, [ tab ]);

    return (
        <div id="admin-products-list">
            { products.map((product) => (
                <ProductListItem id={ product.id } product={ product } products={ products } setProducts={ setProducts }/>
            )) }
        </div>
     );
}
 
export default ProductsList;