import React, { useState, useEffect } from 'react';
import { useSearchDebounce } from '../hooks/useSearchDebounce';
import { BiSearch } from 'react-icons/bi'
import HeaderSearchResult from './HeaderSearchResult';
import axios from 'axios';

const HeaderSearch = () => {
    const [ keywords, setKeywords ] = useSearchDebounce(500);
    const [ searchResults, setSearchResults ] = useState([]);

    useEffect(() => {
        console.log(keywords);
        axios.get(`${process.env.API_URL}/products?limit=5&search=${keywords}`).then((res) => {
            setSearchResults(res.data.products);
        });
    }, [keywords])

  return (
    <div id="header-search-wrap">
        <input type="text" placeholder="מה אתם מחפשים?" setKeywords={(e) => setKeywords(e.target.value)} value={keywords}/>
        <div className="icon">
            <BiSearch/>
        </div>

        <div id="header-search-results">
            { (searchResults || []).map((result) => (
               <HeaderSearchResult result={result}/>
            )) }
        </div>
    </div>
  )
}

export default HeaderSearch