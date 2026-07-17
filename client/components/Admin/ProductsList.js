import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ProductListItem from './ProductListItem';
import axios from 'axios';

const PAGE_SIZE = 20;

const LoadMoreIndicator = () => (
    <div className="admin-load-more-indicator">
        טוען מוצרים נוספים...
    </div>
);

const ProductsList = ({ tab }) => {
    const [ products, setProducts ] = useState([]);
    const [ keywords, setKeywords ] = useState('')
    const [ curPage, setCurPage ] = useState(1);
    const [ hasMore, setHasMore ] = useState(true);

    useEffect(() => {
        setProducts([]);
        setCurPage(1);
        setHasMore(true);
    }, [ keywords ]);

    useEffect(() => {
        let query = ``;
        if (keywords.length) {
            query += `&search=${keywords}`;
        }

        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products?page=${curPage}&limit=${PAGE_SIZE}${query}`).then((res) => {
            setProducts((prevProducts) => curPage === 1 ? res.data.products : prevProducts.concat(res.data.products));
            setHasMore(curPage * PAGE_SIZE < res.data.length);
        });
    }, [ keywords, curPage ]);

    const nextPage = () => {
        if (hasMore) {
            setCurPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <div id="admin-products-list">
            <input type="text" onChange={(e) => setKeywords(e.target.value)} placeholder="חיפוש מוצרים" id="product-search-admin"/>
            <InfiniteScroll
                dataLength={ products.length }
                next={ nextPage }
                hasMore={ hasMore }
                loader={ <LoadMoreIndicator /> }
                endMessage={ <p className="admin-load-more-indicator">הגעתם לסוף הרשימה</p> }
            >
                { (products || []).map((product) => (
                    <ProductListItem key={ product.id } id={ product.id } product={ product } products={ products } setProducts={ setProducts }/>
                )) }
            </InfiniteScroll>
        </div>
     );
}
 
export default ProductsList;