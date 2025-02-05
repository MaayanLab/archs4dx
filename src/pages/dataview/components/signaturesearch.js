import React, { useState } from 'react';
import { Box, TextField, Slider, Typography, TextareaAutosize,ToggleButtonGroup, ToggleButton, Button } from '@mui/material';
import axios from 'axios';
import exampleData from './example_data.json'; // Use relative path to your JSON file
import exampleDataWeights from './example_signature.json'; // Use relative path to your JSON file


export const SignatureSearch = ({setNewSearchResult, species}) => {
  const [signatureName, setSignatureName] = useState('');
  const [knnValue, setKnnValue] = useState(500);
  const [upregulatedGenes, setUpregulatedGenes] = useState('');
  const [downregulatedGenes, setDownregulatedGenes] = useState('');
  const [fullSignature, setFullSignature] = useState('');
  const [isWeightedSignature, setIsWeightedSignature] = useState(false);

  const handleSliderChange = (event, newValue) => {
    setKnnValue(newValue);
  };

  const handleToggleChange = (event, newAlignment) => {
    setIsWeightedSignature(newAlignment === 'weighted');
  };

  const handleExampleClick = () => {

    if(isWeightedSignature){
      const example = exampleDataWeights[species]
      setSignatureName("example profile");
      setFullSignature(example);
    }
    else{
      const example = exampleData[species];
      if (example) {
        setSignatureName(example.signaturename);
        setUpregulatedGenes(example.up_genes.join('\n'));
        setDownregulatedGenes(example.down_genes.join('\n'));
      } else {
        console.error("Example not found");
      }
    }
  };

  const submitknn = async () => {
    if(isWeightedSignature){
      submitfullknn();
    }
    else{
      //const url = "https://maayanlab.cloud/sigpy/data/knn/signature";
      const url = "https://maayanlab.cloud/sigpy/data/knn/signature";
      const data = {
        signatures: [{
          up_genes: upregulatedGenes.split('\n'),
          down_genes: downregulatedGenes.split('\n')
        }],
        species: species,
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
    }
  };

  const submitfullknn = async () => {
    //const url = "https://maayanlab.cloud/sigpy/data/knn/signature";
    const url = "https://maayanlab.cloud/sigpy/data/knn/signature";
    const lines = fullSignature.split("\n");

    const genes = [];
    const values = [];

    lines.forEach(line => {
        const [gene, value] = line.split(",");
        genes.push(gene);
        values.push(parseInt(value, 10));
    });

    const data = {
      signatures: [{
        genes: genes,
        values: values
      }],
      species: species,
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
      <Box sx={{ marginBottom: '5px' }}>
        <TextField
          label="Signature description"
          variant="outlined"
          fullWidth
          value={signatureName}
          onChange={(e) => setSignatureName(e.target.value)}
          sx={{ marginBottom: '0px', marginTop: '10px' }}
          InputLabelProps={{
            shrink: true, // Forces the label to shrink
          }}
        />
        <a
          style={{
            color: '#007bff',
            transition: 'color 0.3s',
            textDecoration: 'none',
            marginBottom: "20px"
          }}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleExampleClick();
          }}
        >
          Try Example
        </a>
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
        
        {/* Toggle between Up/Downregulated Genes and Weighted Signature */}
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

        {/* Conditional Rendering based on the toggle selection */}
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
          </>
        )}

        <button className="colorpicker" onClick={submitknn} style={{ marginTop: '0px', width: "100%" }}>
          Search
        </button>
      </Box>
    </Box>
  );
};