import React, { useState, useEffect } from 'react';
import { Table } from "./table"
import { Grid, Box, Button, Typography, Tooltip } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export const PrismExp = ({ geneSymbol }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://maayanlab.cloud/prismexp/api/v1/gene/${geneSymbol}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        let result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [geneSymbol]);

  const downloadCSV = (dataToDownload, filename) => {
    // Normalize data to ensure is_gold is explicitly true or false
    const normalizedData = dataToDownload.map(row => ({
      ...row,
      is_gold: row.is_gold === true ? true : false // Explicitly set to true or false
    }));

    // Define headers with dataset at the beginning
    const headers = ['dataset', 'term', 'score', 'term_auc', 'is_gold'];
    const csvRows = [
      headers.join(','),
      ...normalizedData.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle is_gold specifically to ensure "true" or "false" strings
          if (header === 'is_gold') {
            return value ? 'true' : 'false';
          }
          // For other fields, use JSON.stringify with fallback
          return JSON.stringify(value ?? '').replace(/"/g, '');
        }).join(',')
      )
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const downloadAllCSV = () => {
    const allData = Object.entries(predictions).flatMap(([key, value]) => 
      value.prediction.map(row => ({
        ...row,
        dataset: key // Include the key as dataset
      }))
    );
    downloadCSV(allData, `${geneSymbol}_all_predictions.csv`);
  };

  const downloadIndividualCSV = (tableData, datasetName) => {
    downloadCSV(tableData, `${geneSymbol}_${datasetName}_predictions.csv`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  const { predictions } = data;

  return (
    <Box sx={{ padding: '1rem' }}>
      <Box sx={{ marginTop: '0.5rem', marginBottom: "1rem", display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '12px', height: '12px', backgroundColor: '#b0f9e9', marginRight: '0.5rem' }} />
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          = previously known annotation
        </Typography>
      </Box>
      <Grid container spacing={6}>
        {Object.entries(predictions).map(([key, value]) => (
          <Grid key={key} item xs={12} xl={6}>
            <Box sx={{ marginBottom: '1rem' }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 500,
                  }}
                >
                  {key.replaceAll("_", " ")}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 400,
                      color: 'text.secondary',
                      marginRight: '0.25rem'
                    }}
                  >
                    Gene AUC: {value.auc ? Number(value.auc).toFixed(3) : 'N/A'}
                  </Typography>
                  <Tooltip 
                    title={
                      <span>
                        The gene AUC reflects how well known gene functions of {geneSymbol} could be retrieved. 
                        An AUC of 1 would represent perfect ranking of gene functions and 0.5 would be random. 
                        Entries colored <span style={{ 
                          display: 'inline-block', 
                          width: '10px', 
                          height: '10px', 
                          backgroundColor: '#b0f9e9', 
                          margin: '0 4px', 
                          verticalAlign: 'middle' 
                        }}></span> represent known gene functions.
                      </span>
                    }
                    arrow
                  >
                    <HelpOutlineIcon 
                      sx={{ 
                        fontSize: '1rem', 
                        color: 'text.secondary',
                        cursor: 'pointer'
                      }} 
                    />
                  </Tooltip>
                </Box>
              </Box>
              <Table 
                tableData={value.prediction} 
                title={key} 
                goldFlagKey="is_gold"
              />
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-start', 
                  marginTop: '0.5rem'
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => downloadIndividualCSV(value.prediction, key)}
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    height: '30px',
                    marginTop: '-50px'
                  }}
                >
                  Download
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <Button
          variant="outlined"
          size="small"
          onClick={downloadAllCSV}
          sx={{ 
            textTransform: 'none',
            fontSize: '0.8rem',
          }}
        >
          Download all PrismEXP predictions
        </Button>
      </Box>
    </Box>
  );
};