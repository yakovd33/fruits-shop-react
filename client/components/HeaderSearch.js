import React, { useState, useEffect } from 'react';
import { useSearchDebounce } from '../hooks/useSearchDebounce';
import { BiSearch } from 'react-icons/bi'
import axios from 'axios';
import ProductShowcase from './ProductShowcase';
const { PRODUCT_THUMBS_PUBLIC_BUCKET } = process.env;

const HeaderSearch = ({ cartItems, setCartItems }) => {
    const [ keywords, setKeywords ] = useSearchDebounce(100);
    const [ searchResults, setSearchResults ] = useState([]);
    const [ searchOpen, setSearchOpen ] = useState(false);

    useEffect(() => {
        if (keywords) {
            axios.get(`${process.env.API_URL}/products?limit=20&search=${keywords}`).then((res) => {
                setSearchResults(res.data.products);
            });
        } else {
            setSearchResults([])
        }
    }, [keywords])

  return (
    <div id="header-search-wrap">
        <input type="text" placeholder="מה אתם מחפשים?" onFocus={() => setSearchOpen(true)} onChange={(e) => setKeywords(e.target.value)} value={keywords}/>
        <div className="icon">
            <BiSearch/>
        </div>

        { searchOpen &&
            <div id="search-closer" onClick={() => setSearchOpen(false)}></div>
        }

        { searchOpen &&
            <div id="header-search-results">
                <div id="header-search-results-wrap">
                    { (searchResults || []).map((product) => (
                        <ProductShowcase
                            id={ product._id }
                            cartItems={cartItems}
                            minAmount={ product.minAmount }
                            setCartItems={setCartItems}
                            description={ product.description }
                            name={product.name}
                            price={product.price}
                            salePrice={product.salePrice}
                            unit={product.unitType}
                            badge={ product.badge }
                            image={`https://${PRODUCT_THUMBS_PUBLIC_BUCKET}/${product.id}.jpg `}
                            type="search"
                        />
                    )) }
                </div>
            </div>
        }
    </div>
  )
}

export default HeaderSearch