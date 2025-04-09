import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';

const styles = {
  button: {
    padding: '6px 15px',
    backgroundColor: '#5bc0de',
    fontWeight: "800",
    width: "100%",
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  loadingButton: {
    padding: '6px 15px',
    backgroundColor: '#cccccc',
    fontWeight: "800",
    width: "100%",
    color: '#666666',
    border: 'none',
    borderRadius: '5px',
    cursor: 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  disabledButton: {
    padding: '6px 15px',
    backgroundColor: '#cccccc',
    fontWeight: "800",
    width: "100%",
    color: '#666666',
    border: 'none',
    borderRadius: '5px',
    cursor: 'not-allowed',
  },
  recalculateButton: {
    padding: '6px 15px',
    backgroundColor: '#5bc0de',
    fontWeight: "800",
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  exampleLink: {
    color: '#5bc0de',
    cursor: 'pointer',
    textDecoration: 'underline',
    marginRight: '10px'
  }
};

const exampleQueries = [
  "breast cancer",
  "diabetes type 2",
  "brain tumor"
];

export const RegexSearchTab = ({species, setNewSearchResult }) => {
  const [metaData, setMetaData] = useState('');
  const [proposedRegex, setProposedRegex] = useState('');
  const [originalRegex, setOriginalRegex] = useState('');
  const [regexExplanation, setRegexExplanation] = useState('');
  const [sampleMatchSize, setSampleMatchSize] = useState(null);
  const [isRegexEdited, setIsRegexEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recalculateLoading, setRecalculateLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleMetaChange = (event) => {
    setMetaData(event.target.value);
    setProposedRegex('');
    setRegexExplanation('');
    setSampleMatchSize(null);
    setIsRegexEdited(false);
  };

  const handleRegexChange = (event) => {
    const newValue = event.target.value;
    setProposedRegex(newValue);
    setIsRegexEdited(newValue !== originalRegex);
  };

  const handleExampleClick = (example) => {
    setMetaData(example);
    setProposedRegex('');
    setRegexExplanation('');
    setSampleMatchSize(null);
    setIsRegexEdited(false);
    generateRegex(example); // Only generates regex, doesn't submit
  };

  const writeLog = async (additionalInfo = '') => {
    try {
      const response = await fetch('https://archs4.org/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          "category": "regex_search", 
          "entry": `${metaData}${additionalInfo}`
        }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
    } catch (error) {
      console.error('Error writing log:', error);
    }
  };

  // This function only generates the regex and updates the UI, no submission
  const generateRegex = async (overrideQuery) => {
    setLoading(true);
    try {
      const query = overrideQuery || metaData;
      
      /*
      const searchCountResponse = await fetch('https://maayanlab.cloud/sigpy/searchcount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "query": query }),
      });
      if (!searchCountResponse.ok) throw new Error('Search count response was not ok');
      const searchCountResult = await searchCountResponse.json();
      setSampleMatchSize(searchCountResult.result_size || 0);
      */
     
      const regexResponse = await fetch('https://maayanlab.cloud/sigpy/regexwizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "query": query }),
      });
      if (!regexResponse.ok) throw new Error('Regex generation response was not ok');
      const regexResult = await regexResponse.json();
      setProposedRegex(regexResult.regular_expression);
      setOriginalRegex(regexResult.regular_expression);
      setRegexExplanation(regexResult.explanation);
      setIsRegexEdited(false);

      const finalCountResponse = await fetch('https://maayanlab.cloud/sigpy/searchcount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "query": regexResult.regular_expression }),
      });
      if (!finalCountResponse.ok) throw new Error('Final search count response was not ok');
      const finalCountResult = await finalCountResponse.json();
      setSampleMatchSize(finalCountResult.result_size || 0);

      writeLog(',regex_wizard_generated');
    } catch (error) {
      console.error('Error during regex generation:', error);
      setProposedRegex('');
      setRegexExplanation('Error generating regex');
      setSampleMatchSize(null);
    } finally {
      setLoading(false);
    }
  };

  const recalculateSampleMatch = async () => {
    setRecalculateLoading(true);
    try {
      const response = await fetch('https://maayanlab.cloud/sigpy/searchcount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "query": proposedRegex }),
      });
      if (!response.ok) throw new Error('Search count response was not ok');
      const result = await response.json();
      setSampleMatchSize(result.result_size || 0);
      setIsRegexEdited(false);
      writeLog(',regex_recalculated');
    } catch (error) {
      console.error('Error recalculating sample match:', error);
      setSampleMatchSize(null);
    } finally {
      setRecalculateLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    writeLog(',regex_wizard_submitted');
    try {
      // First verify the regex has matches
      const verifyResponse = await fetch('https://maayanlab.cloud/sigpy/searchcount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "query": proposedRegex }),
      });
      if (!verifyResponse.ok) throw new Error('Verify search count response was not ok');
      const verifyResult = await verifyResponse.json();
      setSampleMatchSize(verifyResult.result_size || 0);
      if (verifyResult.result_size === 0) {
        throw new Error('No matching samples found for the proposed regex');
      }

      // Send to quicksearch endpoint (assuming this is the correct endpoint)
      const quickSearchResponse = await fetch('https://maayanlab.cloud/sigpy/meta/quicksearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: proposedRegex,
          species: species
        })
      });

      if (!quickSearchResponse.ok) throw new Error('Quick search response was not ok');
      let quickSearchResult = await quickSearchResponse.json();
      quickSearchResult["query"] = metaData;
      quickSearchResult["signame"] = metaData;
      console.log(quickSearchResult);
      // Pass results to parent component
      setNewSearchResult(quickSearchResult);
      
      // Optionally keep local state if needed for display
      //setData({ ...quickSearchResult, searchterm: metaData });

    } catch (error) {
      console.error('Error submitting data:', error);
      setData(null);
      setNewSearchResult(null); // Clear results on error
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box sx={{ padding: '10px' }}>
      <Typography>
      The Regex Wizard uses AI to suggest a regular expression (regex) based on your input. Modify the suggested regex manually as needed. 
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Box sx={{ mb: 1 }}>
          <div style={{ fontSize: "14px" }}>
            Examples:<br />
            {exampleQueries.map((example, index) => (
              <React.Fragment key={index}>
                {index > 0 && ", "}
                <a
                  style={{
                    color: '#007bff',
                    transition: 'color 0.3s',
                    textDecoration: 'none',
                    marginLeft: index === 0 ? '0' : '4px'
                  }}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleExampleClick(example);
                  }}
                >
                  {example}
                </a>
              </React.Fragment>
            ))}
          </div>
        </Box>
        <TextField
          label="Regex Wizard Query"
          value={metaData}
          onChange={handleMetaChange}
          variant="outlined"
          margin="normal"
          multiline
          rows={4}
          fullWidth
          sx={{ backgroundColor: "white" }}
        />
        <button
          type="button"
          onClick={() => generateRegex()}
          style={loading || recalculateLoading ? styles.loadingButton : styles.button}
          disabled={loading || recalculateLoading}
        >
          {loading && !proposedRegex && <CircularProgress size={20} sx={{ color: '#5bc0de' }} />}
          {loading && !proposedRegex ? 'Generating...' : 'Generate Regex'}
        </button>
        {proposedRegex && (
          <Box sx={{ mt: 1 }}>
            <TextField
              label="Proposed Regular Expression"
              value={proposedRegex}
              onChange={handleRegexChange}
              variant="outlined"
              margin="normal"
              multiline
              rows={4}
              fullWidth
              disabled={loading || recalculateLoading}
              sx={{ backgroundColor: "white" }}
            />
            {sampleMatchSize !== null && !isRegexEdited && (
              <Typography variant="caption" sx={{ display: 'block', color: '#666', mt: 1 }}>
                <b>Matching samples: {sampleMatchSize}</b>
              </Typography>
            )}
            {isRegexEdited && (
              <button
                type="button"
                onClick={recalculateSampleMatch}
                style={recalculateLoading ? styles.loadingButton : styles.recalculateButton}
                disabled={recalculateLoading}
              >
                {recalculateLoading && <CircularProgress size={20} sx={{ color: '#5bc0de' }} />}
                {recalculateLoading ? 'Recalculating...' : 'Recalculate Sample Match'}
              </button>
            )}
            {regexExplanation && (
              <Typography variant="caption" sx={{ display: 'block', color: '#666', mt: 1, marginBottom: "12px" }}>
                {regexExplanation}
              </Typography>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              style={loading || recalculateLoading || sampleMatchSize === 0 ? styles.loadingButton : styles.button}
              disabled={loading || recalculateLoading || sampleMatchSize === 0}
            >
              {loading && <CircularProgress size={20} sx={{ color: '#5bc0de' }} />}
              {loading ? 'Loading...' : 'Submit'}
            </button>
            {sampleMatchSize === 0 && (
              <Typography variant="caption" sx={{ display: 'block', color: '#666', mt: 1 }}>
                Submit is not possible: No matching samples found.
              </Typography>
            )}
          </Box>
        )}
      </Box>
      {data && !loading && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="h6">Results for search term: {data.searchterm}</Typography>
          <Typography>Positive correlated genes: {data.positive_correlated_genes?.length || 0}</Typography>
          <Typography>Negative correlated genes: {data.negative_correlated_genes?.length || 0}</Typography>
        </Box>
      )}
    </Box>
  );
};