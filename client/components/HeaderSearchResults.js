import React from 'react';
import QuickSearchItem from './QuickSearchItem';

const HeaderSearchResults = ({ products = [], cartItems, setCartItems, rootId = 'header-search-results', wrapId = 'header-search-results-wrap' }) => (
    <div id={rootId}>
        <div id={wrapId}>
            { products.length > 0 ? (
                products.map((product) => (
                    <QuickSearchItem
                        key={product._id}
                        product={product}
                        cartItems={cartItems}
                        setCartItems={setCartItems}
                    />
                ))
            ) : (
                <p className="search-results-empty">לא נמצאו מוצרים תואמים.</p>
            ) }
        </div>
    </div>
);

export default HeaderSearchResults;
