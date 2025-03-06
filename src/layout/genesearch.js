import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import './genesearch.css';

const styles = {
  form: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    margin: '20px 0',
    position: 'relative',
    backgroundColor: 'white',
  },
  formMobile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '0px', // Set to 0px to eliminate all gap
    margin: '0', // Remove vertical margin to reduce external spacing
    position: 'relative',
    backgroundColor: 'white',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #ccc',
    padding: '5px', // Keep this, but it contributes to height
  },
  icon: {
    marginRight: '5px',
    color: '#888',
  },
  input: {
    border: 'none',
    outline: 'none',
    padding: '5px',
    width: '100%',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#5bc0de',
    fontWeight: "800",
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  suggestionsList: {
    position: 'absolute',
    top: '40px',
    backgroundColor: '#fff',
    borderRadius: "8px",
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    width: '100%',
    zIndex: 1000,
    maxHeight: '150px',
    overflowY: 'auto',
    color: "black",
  },
  suggestionItem: {
    paddingLeft: '10px',
    cursor: 'pointer',
  },
  highlightedItem: {
    backgroundColor: '#f4f4f4',
  },
};

export const GeneSearch = ({ isMobile = false }) => {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (searchText) {
      if (searchText.length > 2) {
        setShowSuggestions(true);
        fetchSuggestions();
      }
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [searchText]);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('https://maayanlab.cloud/sigpy/meta/genes');
      const data = await response.json();
      if (response.ok) {
        const filteredSuggestions = data.genes.filter(gene =>
          gene.toLowerCase().startsWith(searchText.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
        setShowSuggestions(true);
      } else {
        console.error('Error fetching suggestions', data);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const validateSearchText = (text) => {
    const regex = /^[a-zA-Z0-9-_]+$/;
    return regex.test(text);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchText.trim() && validateSearchText(searchText.trim())) {
      window.location.replace(`/gene/${searchText.trim()}`, '_blank');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchText(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="genesearchwrapper">
      <form
        className="genesearchform"
        onSubmit={handleSubmit}
        style={isMobile ? styles.formMobile : styles.form}
      >
        <div style={styles.inputContainer}>
          <SearchIcon style={styles.icon} />
          <input
            type="text"
            value={searchText}
            onChange={handleInputChange}
            placeholder="Search gene"
            style={styles.input}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          />
        </div>
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#48a9c7')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#5bc0de')}
        >
          Search Gene
        </button>
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestionsList" style={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <li
                className="suggestionsItem"
                key={index}
                style={{
                  ...styles.suggestionItem,
                  ...(index === 0 ? styles.highlightedItem : {}),
                }}
                onMouseDown={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
};