import React, { useState, useEffect } from 'react';
import '../styles/Search.css';

const SearchBar = ({ onSearch, placeholder = "Rechercher..." }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    onSearch(query);
  }, [query, onSearch]);

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      {query && (
        <button 
          onClick={() => setQuery('')}
          className="search-clear"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;