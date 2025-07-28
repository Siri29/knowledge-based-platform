import React, { useState, useEffect, useRef } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';
import axios from '../api/axios';

function SearchWithSuggestions({ onSearch, placeholder = "Search...", className = "" }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`/api/pages/suggestions?q=${encodeURIComponent(searchQuery)}`);
      setSuggestions(res.data);
      setShowSuggestions(res.data.length > 0);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce suggestions
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(query);
  };

  return (
    <div ref={searchRef} className={`position-relative ${className}`}>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          />
          <Button type="submit" variant="primary">
            <FiSearch />
          </Button>
        </InputGroup>
      </Form>

      {showSuggestions && (
        <div className="search-suggestions">
          {loading ? (
            <div className="search-suggestion-item text-center">
              <div className="spinner-border spinner-border-sm" role="status"></div>
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="search-suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <FiSearch className="me-2 text-muted" size={14} />
                {suggestion}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default SearchWithSuggestions;