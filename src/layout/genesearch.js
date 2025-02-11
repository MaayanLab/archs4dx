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
    backgroundColor: 'white'
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #ccc',
    padding: '5px',
  },
  icon: {
    marginRight: '5px',
    color: '#888',
  },
  input: {
    border: 'none',
    outline: 'none',
    padding: '5px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#5bc0de',
    fontWeight: "800",
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  suggestionsList: {
    position: 'absolute',
    top: '40px', // Align with input field height
    backgroundColor: '#fff',
    borderRadius: "8px",
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    width: '310px',
    zIndex: 1000,
    maxHeight: '150px',
    overflowY: 'auto',
    color: "white"
  },
  suggestionItem: {
    paddingLeft: '10px',
    cursor: 'pointer',
  },
  highlightedItem: {
    backgroundColor: '#f4f4f4',
  },
};

export const GeneSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (searchText) {
      if (searchText.length > 2){
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

    const writeLog = async (gene) => {
      try {
        const response = await fetch('https://archs4.org/api/log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "category": "genesearch", "entry": gene }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Error writing log:', error);
      }
    };

    event.preventDefault();
    if (searchText.trim() && validateSearchText(searchText.trim())) {
      console.log("submit");
      writeLog(searchText.trim());
      //navigate(`/gene/${searchText.trim()}`);
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
      <form className="genesearchform" onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputContainer}>
          <SearchIcon style={styles.icon} />
          <input
            type="text"
            value={searchText}
            onChange={handleInputChange}
            placeholder="Search gene"
            style={styles.input}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setShowSuggestions(false)}
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
        {showSuggestions && (
          <ul class="suggestionsList" style={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <li
                class="suggestionsItem"
                key={index}
                style={styles.suggestionItem}
                onMouseDown={() => handleSuggestionClick(suggestion)}
                className={styles.suggestionsListItem}
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