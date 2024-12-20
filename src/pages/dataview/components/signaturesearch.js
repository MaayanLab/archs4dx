import React, { useState } from 'react';
import { Box, TextField, Slider, Typography, TextareaAutosize } from '@mui/material';
import axios from 'axios';
import exampleData from './example_data.json'; // Use relative path to your JSON file

export const SignatureSearch = ({setNewSearchResult}) => {
  const [signatureName, setSignatureName] = useState('');
  const [knnValue, setKnnValue] = useState(500);
  const [upregulatedGenes, setUpregulatedGenes] = useState('');
  const [downregulatedGenes, setDownregulatedGenes] = useState('');

  const handleSliderChange = (event, newValue) => {
    setKnnValue(newValue);
  };

  const handleExampleClick = (exampleName) => {
    const example = exampleData[exampleName];

    if (example) {
      setSignatureName(example.signaturename);
      setUpregulatedGenes(example.up_genes.join('\n'));
      setDownregulatedGenes(example.down_genes.join('\n'));
    } else {
      console.error("Example not found");
    }
  };

  const submitknn = async () => {
    //const url = "https://maayanlab.cloud/sigpy/data/knn/signature";
    const url = "http://localhost:5500/sigpy/data/knn/signature";
    const data = {
      signatures: [{
        up_genes: upregulatedGenes.split('\n'),
        down_genes: downregulatedGenes.split('\n')
      }],
      species: "human",
      k: knnValue,
      signame: signatureName
    };

    try {
      const response = await axios.post(url, data);
      const result = response.data;
      
      setNewSearchResult(result);
      //const sample = result.samples[0];
      //console.log("Sample:", sample);
    } catch (error) {
      console.error("Error occurred while fetching data:", error);
    }
  };

  return (
    <Box sx={{ padding: '10px' }}>
      <a
        style={{
          color: '#007bff',
          transition: 'color 0.3s',
          textDecoration: 'none'
        }}
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleExampleClick("mouse");
        }}
      >
        Example
      </a>
      <Box sx={{ marginBottom: '5px' }}>
        <TextField
          label="Signature Name"
          variant="outlined"
          fullWidth
          value={signatureName}
          onChange={(e) => setSignatureName(e.target.value)}
          sx={{ marginBottom: '20px'}}
        />
        <Typography variant="body1" gutterBottom>
          k-NN: {knnValue}
        </Typography>
        <Slider
          value={knnValue}
          onChange={handleSliderChange}
          aria-labelledby="k-NN-slider"
          valueLabelDisplay="auto"
          min={1}
          max={5000}
          sx={{ width: '280px', marginBottom: '20px' }}
        />
        <Typography variant="body1" gutterBottom>
          Upregulated Genes:
        </Typography>
        <TextareaAutosize
          minRows={4}
          maxRows={4}
          value={upregulatedGenes}
          onChange={(e) => setUpregulatedGenes(e.target.value)}
          style={{ width: '100%', height: '50px', marginBottom: '20px' }}
        />
        <Typography variant="body1" gutterBottom>
          Downregulated Genes:
        </Typography>
        <TextareaAutosize
          minRows={4}
          maxRows={4}
          value={downregulatedGenes}
          onChange={(e) => setDownregulatedGenes(e.target.value)}
          style={{ width: '100%', height: '50px', marginBottom: '20px' }}
        />

        <button className="colorpicker" onClick={submitknn} style={{ marginTop: '0px', width: "100%" }}>Search</button>
      </Box>
    </Box>
  );
};