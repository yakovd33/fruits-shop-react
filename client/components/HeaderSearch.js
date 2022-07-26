import React, { useState, useEffect } from 'react';
import { useSearchDebounce } from '../hooks/useSearchDebounce';
import { BiSearch } from 'react-icons/bi'
import axios from 'axios';
import ProductShowcase from './ProductShowcase';

const HeaderSearch = ({ cartItems, setCartItems }) => {
    const [ keywords, setKeywords ] = useSearchDebounce(100);
    const [ searchResults, setSearchResults ] = useState([]);

    useEffect(() => {
        if (keywords) {
            axios.get(`${process.env.API_URL}/products?limit=5&search=${keywords}`).then((res) => {
                setSearchResults(res.data.products);
            });
        } else {
            setSearchResults([])
        }
    }, [keywords])

  return (
    <div id="header-search-wrap">
        <input type="text" placeholder="מה אתם מחפשים?" onChange={(e) => setKeywords(e.target.value)} value={keywords}/>
        <div className="icon">
            <BiSearch/>
        </div>

        <div id="header-search-results">
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
                    image={`https://eropa.co.il/fruits/uploads/${product.id}.jpg `}
                    type="search"
                />
            )) }
        </div>
    </div>
  )
}

export default HeaderSearch