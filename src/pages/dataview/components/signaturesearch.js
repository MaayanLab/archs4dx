import React, { useState } from 'react';
import { Box, TextField, Slider, Typography, TextareaAutosize, ToggleButtonGroup, ToggleButton, Button, Tooltip } from '@mui/material';
import axios from 'axios';
import exampleData from './example_data.json';
import exampleDataWeights from './example_signature.json';

// A simple spinner component
const Spinner = () => (
  <div style={spinnerStyle} aria-label="Loading" />
);

// Inline spinner styles
const spinnerStyle = {
  border: "4px solid rgba(0, 0, 0, 0.1)",
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  borderLeftColor: "#09f",
  animation: "spin 1s linear infinite",
};

// Keyframe for spinner animation
const insertSpinnerKeyframes = () => {
  if (!document.getElementById("spinner-keyframes")) {
    const style = document.createElement("style");
    style.id = "spinner-keyframes";
    style.innerHTML = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
};
insertSpinnerKeyframes();

export const SignatureSearch = ({ setNewSearchResult, species }) => {
  const [signatureName, setSignatureName] = useState('');
  const [knnValue, setKnnValue] = useState(500);
  const [upregulatedGenes, setUpregulatedGenes] = useState('');
  const [downregulatedGenes, setDownregulatedGenes] = useState('');
  const [fullSignature, setFullSignature] = useState('');
  const [isWeightedSignature, setIsWeightedSignature] = useState(false);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(''); // State for warning message

  // Helper function to get unique genes from text
  const getUniqueGenes = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return [...new Set(lines)];
  };

  // Helper function to deduplicate genes and update state
  const deduplicateGenes = (setGenes) => {
    setGenes((prev) => {
      const unique = getUniqueGenes(prev);
      return unique.join('\n');
    });
  };

  const handleSliderChange = (event, newValue) => {
    setKnnValue(newValue);
  };

  const handleToggleChange = (event, newAlignment) => {
    setIsWeightedSignature(newAlignment === 'weighted');
  };

  const handleExampleClick = (e) => {
    e.preventDefault();
    console.log('Populating example for species:', species, 'isWeightedSignature:', isWeightedSignature);

    setWarning(''); // Clear any existing warnings

    if (isWeightedSignature) {
      const example = exampleDataWeights[species];
      if (!example) {
        console.error(`No weighted example data found for species: ${species}`);
        setNewSearchResult({ error: `No weighted example data for species: ${species}`, samples: [] });
        return;
      }
      const exampleName = "weighted search";
      setSignatureName(exampleName);
      setFullSignature(example);
    } else {
      const example = exampleData[species];
      if (!example || !example.signaturename || !Array.isArray(example.up_genes) || !Array.isArray(example.down_genes)) {
        console.error(`Invalid or missing example data for species: ${species}`, example);
        setNewSearchResult({ error: `Invalid example data for species: ${species}`, samples: [] });
        return;
      }
      setSignatureName(example.signaturename);
      setUpregulatedGenes(example.up_genes.join('\n'));
      setDownregulatedGenes(example.down_genes.join('\n'));
    }
  };

  const tempSetNewSearchResult = (result) => {
    setNewSearchResult({
      ...result,
      samples: result.samples || [] // Ensure samples is always an array
    });
  };

  const submitknn = async (overrideSignatureName) => {
    const effectiveSignatureName = overrideSignatureName || signatureName;
    if (!effectiveSignatureName.trim()) {
      setWarning("Please provide a signature description.");
      return;
    }
    setWarning('');

    if (isWeightedSignature) {
      await submitfullknn(effectiveSignatureName);
    } else {
      const url = "https://maayanlab.cloud/sigpy/data/knn/signature";
      const data = {
        signatures: [{
          up_genes: upregulatedGenes.split('\n').filter(gene => gene.trim() !== ''),
          down_genes: downregulatedGenes.split('\n').filter(gene => gene.trim() !== '')
        }],
        species: species,
        k: knnValue,
        signame: effectiveSignatureName
      };

      setLoading(true);
      tempSetNewSearchResult({
        signame: effectiveSignatureName,
        species: species,
        samples: [],
        series_count: "Loading...",
        indexes: [],
        distances: [],
        status: 'loading'
      });

      try {
        const response = await axios.post(url, data);
        const result = response.data || { samples: [] };
        tempSetNewSearchResult(result);
      } catch (error) {
        console.error("Error occurred while fetching data:", error);
        tempSetNewSearchResult({ error: error.message, samples: [] });
      } finally {
        setLoading(false);
      }
    }
  };

  const submitfullknn = async (overrideSignatureName) => {
    const effectiveSignatureName = overrideSignatureName || signatureName;
    if (!effectiveSignatureName.trim()) {
      setWarning("Please provide a signature description.");
      return;
    }
    setWarning('');

    const url = "https://maayanlab.cloud/sigpy/data/knn/signature";
    const lines = fullSignature.split("\n").filter(line => line.trim() !== '');

    const genes = [];
    const values = [];

    try {
      lines.forEach(line => {
        const [gene, value] = line.split(",");
        if (!gene || !value) throw new Error(`Invalid format in line: ${line}`);
        genes.push(gene.trim());
        values.push(parseInt(value, 10));
      });
    } catch (error) {
      console.error("Error parsing weighted signature:", error);
      tempSetNewSearchResult({ error: error.message, samples: [] });
      setLoading(false);
      return;
    }

    const data = {
      signatures: [{
        genes: genes,
        values: values
      }],
      species: species,
      k: knnValue,
      signame: effectiveSignatureName
    };

    setLoading(true);
    tempSetNewSearchResult({
      signame: effectiveSignatureName,
      species: species,
      samples: [],
      series_count: "Loading...",
      indexes: [],
      distances: [],
      status: 'loading'
    });

    try {
      const response = await axios.post(url, data);
      const result = response.data || { samples: [] };
      tempSetNewSearchResult(result);
    } catch (error) {
      console.error("Error occurred while fetching data:", error);
      tempSetNewSearchResult({ error: error.message, samples: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: '10px' }}>
      <Box sx={{ marginBottom: '5px' }}>
        <TextField
          label="Signature description"
          variant="outlined"
          fullWidth
          value={signatureName}
          onChange={(e) => setSignatureName(e.target.value)}
          sx={{
            marginBottom: '0px',
            marginTop: '10px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: warning ? 'red' : 'inherit', // Red border when warning exists
              },
              '&:hover fieldset': {
                borderColor: warning ? 'red' : 'inherit',
              },
              '&.Mui-focused fieldset': {
                borderColor: warning ? 'red' : 'primary.main',
              },
            },
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        {warning && (
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'red',
                  fontWeight: 'bold',
                  backgroundColor: '#ffe6e6', // Light red background
                  padding: '4px 8px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                {warning}
              </Typography>
            </Box>
          )}
        <Box sx={{ marginBottom: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
            <a
              style={{
                color: '#007bff',
                transition: 'color 0.3s',
                textDecoration: 'none',
                marginRight: '10px',
              }}
              href="#"
              onClick={handleExampleClick}
            >
              Load Example
            </a>
          </Box>
          
        </Box>
        <Typography variant="body1" gutterBottom sx={{ marginTop: '20px' }}>
          k-NN: {knnValue}
        </Typography>
        <Slider
          value={knnValue}
          onChange={handleSliderChange}
          aria-labelledby="k-NN-slider"
          valueLabelDisplay="auto"
          min={1}
          max={5000}
          sx={{ width: '280px', marginBottom: '20px', marginTop: '-10px' }}
        />
        
        <ToggleButtonGroup
          value={isWeightedSignature ? 'weighted' : 'genes'}
          exclusive
          onChange={handleToggleChange}
          aria-label="select genes or weighted signature"
          sx={{ marginBottom: '20px' }}
        >
          <ToggleButton value="genes" aria-label="up-down regulated genes">
            Up/Downregulated Genes
          </ToggleButton>
          <ToggleButton value="weighted" aria-label="weighted signature">
            Weighted Signature
          </ToggleButton>
        </ToggleButtonGroup>

        {isWeightedSignature ? (
          <>
            <Typography variant="body1" gutterBottom>
              Weighted Signature:
            </Typography>
            <TextareaAutosize
              minRows={4}
              maxRows={4}
              value={fullSignature}
              onChange={(e) => setFullSignature(e.target.value)}
              style={{ width: '100%', height: '50px', marginBottom: '20px' }}
            />
          </>
        ) : (
          <>
            {/* Upregulated Genes Section */}
            <Typography variant="body1" gutterBottom>
              Upregulated Genes ({getUniqueGenes(upregulatedGenes).length}):
            </Typography>
            <TextareaAutosize
              minRows={4}
              maxRows={4}
              value={upregulatedGenes}
              onChange={(e) => setUpregulatedGenes(e.target.value)}
              onPaste={(e) => {
                setTimeout(() => deduplicateGenes(setUpregulatedGenes), 100);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files.length > 0) {
                  const file = e.dataTransfer.files[0];
                  if (file.type === 'text/plain') {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const text = event.target.result;
                      const uniqueGenes = getUniqueGenes(text);
                      setUpregulatedGenes(uniqueGenes.join('\n'));
                    };
                    reader.readAsText(file);
                  }
                } else {
                  const text = e.dataTransfer.getData('text');
                  if (text) {
                    const uniqueGenes = getUniqueGenes(text);
                    setUpregulatedGenes(uniqueGenes.join('\n'));
                  }
                }
              }}
              onDragOver={(e) => e.preventDefault()}
              style={{ width: '100%', height: '50px', marginBottom: '20px', paddingLeft: "5px" }}
            />

            {/* Downregulated Genes Section */}
            <Typography variant="body1" gutterBottom>
              Downregulated Genes ({getUniqueGenes(downregulatedGenes).length}):
            </Typography>
            <TextareaAutosize
              minRows={4}
              maxRows={4}
              value={downregulatedGenes}
              onChange={(e) => setDownregulatedGenes(e.target.value)}
              onPaste={(e) => {
                setTimeout(() => deduplicateGenes(setDownregulatedGenes), 100);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files.length > 0) {
                  const file = e.dataTransfer.files[0];
                  if (file.type === 'text/plain') {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const text = event.target.result;
                      const uniqueGenes = getUniqueGenes(text);
                      setDownregulatedGenes(uniqueGenes.join('\n'));
                    };
                    reader.readAsText(file);
                  }
                } else {
                  const text = e.dataTransfer.getData('text');
                  if (text) {
                    const uniqueGenes = getUniqueGenes(text);
                    setDownregulatedGenes(uniqueGenes.join('\n'));
                  }
                }
              }}
              onDragOver={(e) => e.preventDefault()}
              style={{ width: '100%', height: '50px', marginBottom: '20px', paddingLeft: "5px" }}
            />
          </>
        )}

        <button
          className="colorpicker"
          onClick={() => submitknn()} // Pass undefined to use state value
          disabled={loading}
          style={{
            marginTop: '0px',
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "8px 16px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: loading ? "#eeeeee" : "",
            color: loading ? "#888888" : "#ffffff",
          }}
        >
          {loading ? (
            <>
              <Spinner /> <span style={{ marginLeft: "8px" }}>Loading...</span>
            </>
          ) : (
            "Search"
          )}
        </button>
      </Box>
    </Box>
  );
};