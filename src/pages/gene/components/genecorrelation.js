
import React, { useState } from 'react';
import { Box, Grid, Typography, TextField, Slider, Skeleton } from '@mui/material';
import correlation from '../../../image/correlation.png';
import { CorrelationTable } from './correlationtable';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material'; 

const styles = {
  button: {
    padding: '10px 15px',
    backgroundColor: '#5bc0de',
    fontWeight: "800",
    width: "300px",
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }
}

export const GeneCorrelation = ({ geneName }) => {
  const [data, setData] = useState(null);
  const [kValue, setKValue] = useState(100);
  const [metaData, setMetaData] = useState('');
  const [loading, setLoading] = useState(false);

  const handleKChange = (event, newValue) => {
    setKValue(newValue);
  };

  const handleMetaChange = (event) => {
    setMetaData(event.target.value);
  };

  const writeLog = async () => {
    try {
      const response = await fetch('https://archs4.org/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "category": "correlation", "entry": geneName+","+metaData}),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error writing log:', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    writeLog();
    try {
      const response = await fetch('https://maayanlab.cloud/sigpy/data/correlation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          k: kValue,
          meta: metaData,
          gene: geneName,
          species: "human"
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '20px',
            marginBottom: '30px',
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <img
              src={correlation}
              alt="correlation"
              style={{
                width: '70px',
                height: '70px',
                marginRight: '30px',
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
              width: "340px"
            }}
          >
            <Typography gutterBottom>Number of genes (k):</Typography>
            <Slider
              value={kValue}
              onChange={handleKChange}
              aria-labelledby="k-slider"
              min={1}
              max={500}
              valueLabelDisplay="auto"
              sx={{ width: "300px" }}
            />
            <TextField
              label="Metadata"
              value={metaData}
              onChange={handleMetaChange}
              variant="outlined"
              margin="normal"
              fullWidth
              sx={{
                backgroundColor: "white",
                width: "300px",
                "& .MuiInputLabel-outlined": {
                  transform: "translate(14px, 4px) scale(1)", // Adjust initial position (lower number moves it up)
                },
                "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
                  transform: "translate(14px, -6px) scale(0.75)", // Position when shrunk (focused or with value)
                },
              }}
            />
            <button
              type="button"
              onClick={handleSubmit}
              style={styles.button}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#48a9c7')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#5bc0de')}
            >
              {loading ? 'Loading...' : 'Submit'}
            </button>
          </Box>
        </Box>
      </Grid>

      {loading && (
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
            <Typography variant="body2" color="error">
              Low expression of {geneName} in {data.searchterm} can lead to biased correlations.
            </Typography>
          )}
          </Grid>
          <Grid item md={12} lg={6} sx={{ padding: '20px' }}>
              <Typography variant="h6">
                <ArrowUpward style={{ verticalAlign: 'middle', marginRight: '8px' }} />
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