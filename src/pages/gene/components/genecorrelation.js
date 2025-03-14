import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, TextField, Slider, Skeleton, Switch, FormControlLabel, Button, CircularProgress } from '@mui/material';
import correlation from '../../../image/correlation.png';
import { CorrelationTable } from './correlationtable';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material'; 

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
    gap: '8px', // Ensures spacing between elements
    minHeight: '36px',
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
    gap: '8px', // Ensures spacing between spinner and text
    minHeight: '36px',
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
    minHeight: '36px',
  },
  recalculateButton: {
    padding: '6px 15px',
    backgroundColor: '#5bc0de',
    fontWeight: "800",
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    minHeight: '36px',
  },
  exampleContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  exampleButton: {
    margin: '5px 0',
    backgroundColor: '#f0f0f0',
    color: '#333',
    textAlign: 'left',
    justifyContent: 'flex-start',
    '&:hover': {
      backgroundColor: '#e0e0e0'
    }
  }
}

export const GeneCorrelation = ({ geneName }) => {
  const [data, setData] = useState(null);
  const [kValue, setKValue] = useState(100);
  const [inputValue, setInputValue] = useState('100');
  const [metaData, setMetaData] = useState('');
  const [useRegexWizard, setUseRegexWizard] = useState(true);
  const [loading, setLoading] = useState(false);
  const [recalculateLoading, setRecalculateLoading] = useState(false);
  const [proposedRegex, setProposedRegex] = useState('');
  const [originalRegex, setOriginalRegex] = useState('');
  const [regexExplanation, setRegexExplanation] = useState('');
  const [sampleMatchSize, setSampleMatchSize] = useState(null);
  const [isRegexEdited, setIsRegexEdited] = useState(false);

  const examples = [
    { label: "Brain Cancer", value: "brain cancer" },
    { label: "Immune Cells", value: "granulocytes and their related cell types" },
    { label: "Fibrosis", value: "lung tissue fibrosis" }
  ];

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

  const handleExampleClick = async (exampleValue) => {
    setLoading(true);
    setMetaData(exampleValue);
    setProposedRegex('');
    setRegexExplanation('');
    setSampleMatchSize(null);
    setIsRegexEdited(false);
    await generateRegex(exampleValue);
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

  const generateRegex = async (overrideMetaData) => {
    setLoading(true);
    try {
      const queryData = overrideMetaData || metaData;
      const searchCountResponse = await fetch('https://maayanlab.cloud/sigpy/searchcount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "query": queryData }),
      });
      if (!searchCountResponse.ok) throw new Error('Search count response was not ok');
      const searchCountResult = await searchCountResponse.json();
      const sampleSize = searchCountResult.result_size || 0;
      setSampleMatchSize(sampleSize);

      const regexResponse = await fetch('https://maayanlab.cloud/sigpy/regexwizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "query": queryData }),
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
    writeLog(useRegexWizard ? ',regex_wizard_submitted' : '');
    try {
      const finalMetaData = useRegexWizard ? proposedRegex : metaData;
      
      if (useRegexWizard) {
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
      }

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
      setData({ ...result, searchterm: metaData });
      console.log(result);

      fetch('https://maayanlab.cloud/Enrichr/addList', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          list: result.positive_correlated_genes.map(gene => gene.gene).join('\n'),
          description: `${metaData} positive correlation`
        })
      });

      fetch('https://maayanlab.cloud/Enrichr/addList', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          list: result.negative_correlated_genes.map(gene => gene.gene).join('\n'),
          description: `${metaData} negative correlation`
        })
      });

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
                Enter a free-text description of the samples you want to analyze. The Regex Wizard will use AI to suggest a regular expression (regex) based on your input. You can then modify the suggested regex manually if needed. 
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Slider
                value={kValue}
                onChange={handleKChange}
                aria-labelledby="k-slider"
                min={1}
                max={500}
                step={1}
                valueLabelDisplay="auto"
                sx={{ width: { xs: '60%', sm: "400px" }, mr: 2 }}
              />
              <Box sx={styles.exampleContainer}>
                {examples.map((example) => (
                  <Button
                    key={example.label}
                    variant="contained"
                    sx={styles.exampleButton}
                    onClick={() => handleExampleClick(example.value)}
                    disabled={loading || recalculateLoading}
                  >
                    {example.label}
                  </Button>
                ))}
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Box>
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
                      onClick={() => generateRegex()}
                      style={loading || recalculateLoading ? styles.loadingButton : styles.button}
                      onMouseOver={(e) => !(loading || recalculateLoading) && (e.currentTarget.style.backgroundColor = '#48a9c7')}
                      onMouseOut={(e) => !(loading || recalculateLoading) && (e.currentTarget.style.backgroundColor = '#5bc0de')}
                      disabled={loading || recalculateLoading}
                    >
                      {loading && !proposedRegex && (
                        <>
                          <CircularProgress size={20} sx={{ color: '#666666', marginRight: '8px' }} />
                          Generating...
                        </>
                      )}
                      {!(loading && !proposedRegex) && 'Generate Regex'}
                    </button>
                  )}
                  {!useRegexWizard && (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      style={loading || recalculateLoading ? styles.loadingButton : styles.button}
                      onMouseOver={(e) => !(loading || recalculateLoading) && (e.currentTarget.style.backgroundColor = '#48a9c7')}
                      onMouseOut={(e) => !(loading || recalculateLoading) && (e.currentTarget.style.backgroundColor = '#5bc0de')}
                      disabled={loading || recalculateLoading}
                    >
                      {loading && (
                        <>
                          <CircularProgress size={20} sx={{ color: '#666666', marginRight: '8px' }} />
                          Loading...
                        </>
                      )}
                      {!loading && 'Submit'}
                    </button>
                  )}
                </Box>
                
                {useRegexWizard && proposedRegex && (
                  <Box>
                    <TextField
                      label="Proposed Regular Expression"
                      value={proposedRegex}
                      onChange={handleRegexChange}
                      variant="outlined"
                      margin="normal"
                      multiline
                      rows={4}
                      fullWidth
                      disabled={loading || recalculateLoading || !proposedRegex}
                      sx={{
                        backgroundColor: "white",
                        "& .MuiInputLabel-outlined": { transform: "translate(14px, 4px) scale(1)" },
                        "& .MuiInputLabel-outlined.MuiInputLabel-shrink": { transform: "translate(14px, -6px) scale(0.75)" },
                      }}
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
                        onMouseOver={(e) => !recalculateLoading && (e.currentTarget.style.backgroundColor = '#48a9c7')}
                        onMouseOut={(e) => !recalculateLoading && (e.currentTarget.style.backgroundColor = '#5bc0de')}
                        disabled={recalculateLoading}
                      >
                        {recalculateLoading && (
                          <>
                            <CircularProgress size={20} sx={{ color: '#666666', marginRight: '8px' }} />
                            Recalculating...
                          </>
                        )}
                        {!recalculateLoading && 'Recalculate Sample Match'}
                      </button>
                    )}
                    {regexExplanation && (
                      <Typography variant="caption" sx={{ display: 'block', color: '#666', mt: 1, marginBottom: "10px" }}>
                        {regexExplanation}
                      </Typography>
                    )}
                    <button
                      type="button"
                      onClick={handleSubmit}
                      style={sampleMatchSize === null || sampleMatchSize === 0 || loading || recalculateLoading ? styles.disabledButton : styles.button}
                      onMouseOver={(e) => {
                        if (sampleMatchSize !== null && sampleMatchSize !== 0 && !loading && !recalculateLoading) e.currentTarget.style.backgroundColor = '#48a9c7';
                      }}
                      onMouseOut={(e) => {
                        if (sampleMatchSize !== null && sampleMatchSize !== 0 && !loading && !recalculateLoading) e.currentTarget.style.backgroundColor = '#5bc0de';
                      }}
                      disabled={sampleMatchSize === null || sampleMatchSize === 0 || loading || recalculateLoading}
                    >
                      {loading && (
                        <>
                          <CircularProgress size={20} sx={{ color: '#666666', marginRight: '8px' }} />
                          Loading...
                        </>
                      )}
                      {!loading && 'Submit'}
                    </button>
                    {sampleMatchSize === 0 && (
                      <Typography variant="caption" sx={{ display: 'block', color: '#666', mt: 1 }}>
                        Submit is not possible: No matching samples found.
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
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
              <Typography variant="h6" sx={{ mt: 2 }}>
                Correlation results for search term: {data.searchterm}
              </Typography>
            </Grid>
            <Grid item md={12} lg={6} sx={{ padding: '20px' }}>
              <Typography variant="h6">
                <ArrowUpward style={{ verticalAlign: 'middle', marginRight: '8px'}} />
                Positive correlation
              </Typography>
              <CorrelationTable tableData={data.positive_correlated_genes} searchTerm={metaData} gene={geneName} direction={"positive"}/>
            </Grid>
            <Grid item md={12} lg={6} sx={{ padding: '20px' }}>
              <Typography variant="h6">
                <ArrowDownward style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                Negative correlation
              </Typography>
              <CorrelationTable tableData={data.negative_correlated_genes} searchTerm={metaData} gene={geneName} direction={"negative"}/>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};