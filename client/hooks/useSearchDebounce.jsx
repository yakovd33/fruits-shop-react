import React, { useState, useEffect } from 'react'

export function useSearchDebounce(delay = 350) {
    const [search, setSearch] = useState(null);
    const [searchQuery, setSearchQuery] = useState(null);
  
    useEffect(() => {
      const delayFn = setTimeout(() => setSearch(searchQuery), delay);
      return () => clearTimeout(delayFn);
    }, [searchQuery, delay]);
  
    return [search, setSearchQuery];
  }
  