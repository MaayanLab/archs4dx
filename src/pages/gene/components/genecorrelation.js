import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, TextField, Slider, Skeleton, Switch, FormControlLabel } from '@mui/material';
import correlation from '../../../image/correlation.png';
import { CorrelationTable } from './correlationtable';
import { ArrowUpward, ArrowDownward, ArrowForward } from '@mui/icons-material'; 

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
    marginTop: '8px'
  }
}

export const GeneCorrelation = ({ geneName }) => {
  const [data, setData] = useState(null);
  const [kValue, setKValue] = useState(100);
  const [inputValue, setInputValue] = useState('100');
  const [metaData, setMetaData] = useState('');
  const [useRegexWizard, setUseRegexWizard] = useState(true);
  const [loading, setLoading] = useState(false);
  const [proposedRegex, setProposedRegex] = useState('');
  const [originalRegex, setOriginalRegex] = useState(''); // Store original regex
  const [regexExplanation, setRegexExplanation] = useState('');
  const [sampleMatchSize, setSampleMatchSize] = useState(null);
  const [isRegexEdited, setIsRegexEdited] = useState(false); // Track if regex was edited

  useEffect(() => {
    setInputValue(kValue.toString());
  }, [kValue]);

  const handleKChange = (event, newValue) => {
    setKValue(newValue);
  };

  const handleKInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    const numValue = Number(value);
    if (!isNaN(numValue) && Number.isInteger(numValue) && numValue >= 1 && numValue <= 500) {
      setKValue(numValue);
    }
  };

  const handleKBlur = () => {
    if (!inputValue || isNaN(Number(inputValue)) || Number(inputValue) < 1) {
      setKValue(1);
    } else if (Number(inputValue) > 500) {
      setKValue(500);
    }
    setInputValue(kValue.toString());
  };

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

  const handleToggleChange = (event) => {
    setUseRegexWizard(event.target.checked);
    setProposedRegex('');
    setRegexExplanation('');
    setSampleMatchSize(null);
    setIsRegexEdited(false);
  };

  const writeLog = async (additionalInfo = '') => {
    try {
      const response = await fetch('https://archs4.org/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          "category": "correlation", 
          "entry": `${geneName},${metaData}${additionalInfo}`
        }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
    } catch (error) {
      console.error('Error writing log:', error);
    }
  };

  const generateRegex = async () => {
    setLoading(true);
    try {
      const searchCountResponse = await fetch('https://maayanlab.cloud/sigpy/searchcount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "query": metaData }),
      });
      if (!searchCountResponse.ok) throw new Error('Search count response was not ok');
      const searchCountResult = await searchCountResponse.json();
      const sampleSize = searchCountResult.result_size || 0;
      setSampleMatchSize(sampleSize);

      const regexResponse = await fetch('https://maayanlab.cloud/sigpy/regexwizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "query": metaData }),
      });
      if (!regexResponse.ok) throw new Error('Regex generation response was not ok');
      const regexResult = await regexResponse.json();
      setProposedRegex(regexResult.regular_expression);
      setOriginalRegex(regexResult.regular_expression); // Store original regex
      setRegexExplanation(regexResult.explanation);
      setIsRegexEdited(false);
      writeLog(',regex_wizard_generated');

      if (!regexResult.explanation) {
        await handleSubmit();
      }
    } catch (error) {
      console.error('Error during regex generation:', error);
      setProposedRegex('');
      setRegexExplanation('Error generating regex');
      setSampleMatchSize(null);
      setIsRegexEdited(false);
    } finally {
      setLoading(false);
    }
  };

  const recalculateSampleMatch = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    writeLog(useRegexWizard ? ',regex_wizard_submitted' : '');
    try {
      const finalMetaData = useRegexWizard ? proposedRegex : metaData;
      const response = await fetch('https://maayanlab.cloud/sigpy/data/correlation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          k: kValue,
          meta: finalMetaData,
          gene: geneName,
          species: "human"
        })
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      setData(result);
      console.log(result);
    } catch (error) {
      console.error('Error submitting data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Box sx={{ width: '100%', mb: '30px' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '30px' }}>
            <img
              src={correlation}
              alt="correlation"
              style={{
                width: '70px',
                height: '70px',
                marginTop: '4px',
                transition: 'width 0.3s ease-in-out',
              }}
            />
            <Box>
              <Typography variant="h6">Gene Correlation</Typography>
              <Typography>
                Find top correlated genes for gene {geneName}. The correlation calculation can be constrained with metadata information. The service will extract up to 2000 samples matching the metadata search term and retrieve the top k genes and their Pearson correlation score.
              </Typography>
            </Box>
          </Box>
          
          <Box
            sx={{
              borderRadius: "12px",
              backgroundColor: "#cfffee",
              padding: "20px",
              mt: '20px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px', mb: 2 }}>
              <Typography>Number of genes (k):</Typography>
              <TextField
                value={inputValue}
                onChange={handleKInputChange}
                onBlur={handleKBlur}
                variant="outlined"
                size="small"
                type="text"
                sx={{ width: '80px', backgroundColor: 'white' }}
              />
            </Box>
            <Slider
              value={kValue}
              onChange={handleKChange}
              aria-labelledby="k-slider"
              min={1}
              max={500}
              step={1}
              valueLabelDisplay="auto"
              sx={{ width: { xs: '100%', sm: "400px" } }}
            />
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', lg: 'row' }, 
                alignItems: { xs: 'stretch', lg: 'flex-start' }, // Updated for top alignment
                gap: '20px', 
                mt: 2 
              }}
            >
              <Box sx={{ flex: 1, width: { xs: '100%', lg: 'auto' } }}>
                <TextField
                  label={useRegexWizard ? "Regex Wizard Query" : "Metadata"}
                  value={metaData}
                  onChange={handleMetaChange}
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={4}
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    "& .MuiInputLabel-outlined": { transform: "translate(14px, 4px) scale(1)" },
                    "& .MuiInputLabel-outlined.MuiInputLabel-shrink": { transform: "translate(14px, -6px) scale(0.75)" },
                  }}
                />
                {useRegexWizard && (
                  <button
                    type="button"
                    onClick={generateRegex}
                    style={styles.button}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#48a9c7')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#5bc0de')}
                  >
                    {loading && !proposedRegex ? 'Generating...' : 'Generate Regex'}
                  </button>
                )}
                {!useRegexWizard && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    style={styles.button}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#48a9c7')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#5bc0de')}
                  >
                    {loading ? 'Loading...' : 'Submit'}
                  </button>
                )}
              </Box>
              
              {useRegexWizard && proposedRegex && (
                <>
                  <Box sx={{ display: { xs: 'flex', lg: 'none' }, justifyContent: 'center' }}>
                    <ArrowDownward sx={{ fontSize: 40, color: '#666' }} />
                  </Box>
                  <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center' }}>
                    <ArrowForward sx={{ fontSize: 40, color: '#666', marginTop: "60px" }} />
                  </Box>
                  <Box sx={{ flex: 1, width: { xs: '100%', lg: 'auto' } }}>
                    <TextField
                      label="Proposed Regular Expression"
                      value={proposedRegex}
                      onChange={handleRegexChange}
                      variant="outlined"
                      margin="normal"
                      multiline
                      rows={4}
                      fullWidth
                      disabled={!proposedRegex}
                      sx={{
                        backgroundColor: "white",
                        "& .MuiInputLabel-outlined": { transform: "translate(14px, 4px) scale(1)" },
                        "& .MuiInputLabel-outlined.MuiInputLabel-shrink": { transform: "translate(14px, -6px) scale(0.75)" },
                      }}
                    />
                    {sampleMatchSize !== null && !isRegexEdited && (
                      <Typography variant="caption" sx={{ display: 'block', color: '#666', mt: 1 }}>
                        Sample match size: {sampleMatchSize}
                      </Typography>
                    )}
                    {isRegexEdited && (
                      <button
                        type="button"
                        onClick={recalculateSampleMatch}
                        style={styles.recalculateButton}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#48a9c7')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#5bc0de')}
                      >
                        {loading ? 'Recalculating...' : 'Recalculate Sample Match'}
                      </button>
                    )}
                    {regexExplanation && (
                      <Typography variant="caption" sx={{ display: 'block', color: '#666', mt: 1 }}>
                        {regexExplanation}
                      </Typography>
                    )}
                    <button
                      type="button"
                      onClick={handleSubmit}
                      style={sampleMatchSize === 0 ? styles.disabledButton : styles.button}
                      onMouseOver={(e) => {
                        if (sampleMatchSize !== 0) e.currentTarget.style.backgroundColor = '#48a9c7';
                      }}
                      onMouseOut={(e) => {
                        if (sampleMatchSize !== 0) e.currentTarget.style.backgroundColor = '#5bc0de';
                      }}
                      disabled={sampleMatchSize === 0}
                    >
                      {loading ? 'Loading...' : 'Submit'}
                    </button>
                    {sampleMatchSize === 0 && (
                      <Typography variant="caption" sx={{ display: 'block', color: '#666', mt: 1 }}>
                        Submit is not possible: No matching samples found.
                      </Typography>
                    )}
                  </Box>
                </>
              )}
            </Box>

            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={<Switch checked={useRegexWizard} onChange={handleToggleChange} color="primary" />}
                label="Use Regex Wizard"
              />
            </Box>
          </Box>
        </Box>
      </Grid>

      {loading && proposedRegex && (
        <Box>
          <Skeleton animation="wave" height={40} />
          <Skeleton animation="wave" height={40} />
          <Skeleton animation="wave" height={40} />
        </Box>
      )}

      {data && !loading && (
        <Box>
          <Grid container>
            <Grid item md={12}>
              {geneName} log expression: {data.mean_log_expression.toFixed(3)}
              {data.mean_log_expression < 3 && (
                <Typography variant="caption" color="error">
                  Low expression of {geneName} in {data.searchterm} can lead to biased correlations.
                </Typography>
              )}
            </Grid>
            <Grid item md={12} lg={6} sx={{ padding: '20px' }}>
              <Typography variant="h6">
                <ArrowUpward style={{ verticalAlign: 'middle', marginRight: '8px'}} />
                Positive correlation ({data.searchterm})
              </Typography>
              <CorrelationTable tableData={data.positive_correlated_genes} />
            </Grid>
            <Grid item md={12} lg={6} sx={{ padding: '20px' }}>
              <Typography variant="h6">
                <ArrowDownward style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                Negative correlation ({data.searchterm})
              </Typography>
              <CorrelationTable tableData={data.negative_correlated_genes} />
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};