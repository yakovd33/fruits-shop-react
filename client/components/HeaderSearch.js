import React, { useState, useEffect } from 'react';
import { useSearchDebounce } from '../hooks/useSearchDebounce';
import { BiSearch } from 'react-icons/bi'
import axios from 'axios';
import HeaderSearchResults from './HeaderSearchResults';

const HeaderSearch = ({ cartItems, setCartItems, variant = 'desktop' }) => {
    const [ keywords, setKeywords ] = useSearchDebounce(100);
    const [ searchResults, setSearchResults ] = useState([]);
    const [ searchOpen, setSearchOpen ] = useState(false);

    const idPrefix = variant === 'mobile' ? 'mobile-' : '';
    const wrapId = `${idPrefix}header-search-wrap`;
    const closerId = `${idPrefix}search-closer`;
    const resultsId = `${idPrefix}header-search-results`;
    const resultsWrapId = `${idPrefix}header-search-results-wrap`;

    useEffect(() => {   
        if (keywords) {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=20&search=${keywords}`).then((res) => {
                setSearchResults(res.data.products);
            });
        } else {
            setSearchResults([])
        }
    }, [keywords])

  return (
    <div id={wrapId}>
        <input type="text" placeholder="מה אתם מחפשים?" onFocus={() => setSearchOpen(true)} onChange={(e) => setKeywords(e.target.value)} value={keywords}/>
        <div className="icon">
            <BiSearch/>
        </div>

        { searchOpen &&
            <div id={closerId} onClick={() => setSearchOpen(false)}></div>
        }

        { searchOpen &&
            <HeaderSearchResults
                products={searchResults}
                cartItems={cartItems}
                setCartItems={setCartItems}
                rootId={resultsId}
                wrapId={resultsWrapId}
            />
        }
    </div>
  )
}

export default HeaderSearch