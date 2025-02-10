
import React, { useState } from "react";
import { DiffTable } from "./diffgenetable";
import { Slider, Typography, TextField} from '@mui/material';

// A simple spinner component (you can replace with your own spinner)
const Spinner = () => (
  <div style={spinnerStyle} aria-label="Loading" />
);

// Inline spinner styles; you can move these to a CSS file
const spinnerStyle = {
  border: "4px solid rgba(0, 0, 0, 0.1)",
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  borderLeftColor: "#09f",
  animation: "spin 1s linear infinite",
};

// Keyframe for spinner animation, inserted into document.head if needed.
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

function getTopKGenes(json, k) {

  // Convert json.genes to an array if not already an array.
  const genesArray = Array.isArray(json.genes) ? json.genes : Array.from(json.genes);

  // Sort the array based on the fdr value (ascending order)
  const sortedGenes = genesArray.sort((a, b) => b.t - a.t);

  // Take the top k genes and extract the gene names
  const topKGeneNames = sortedGenes.slice(0, k).map(item => item.gene);

  return topKGeneNames;
}

export const DiffExpQuery = ({setNewGeneSearchResult, species}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [meta, setMeta] = useState("");
  const [knnValue, setKnnValue] = useState(500);

  const handleSliderChange = (event, newValue) => {
    setKnnValue(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null); // clear previous results if any
    
    const url = "https://maayanlab.cloud/sigpy/data/diffexp";
    const payload = {
      meta: meta,
      fdr_cutoff: 0.01,
      species: species["species"],
      k: knnValue // additional parameter
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`);
      }

      let json = await res.json();
      json["species"] = species;
      json["query"] = meta;

      let genes = getTopKGenes(json, knnValue);
      json["genes"] = genes;
      console.log("ww",json);

      setResult(json);
      setNewGeneSearchResult(json);
    } catch (error) {
      console.error("Error querying endpoint:", error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", margin: "20px" }}>
      <h2>Search Genes</h2>
      <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "12px" }}>
          <Typography variant="body1" gutterBottom sx={{ marginTop: '20px' }}>
            Search Term (Meta):
          </Typography>
            <TextField
                      label="Search term"
                      variant="outlined"
                      fullWidth
                      value={meta}
                      onChange={(e) => setMeta(e.target.value)}
                      sx={{ marginBottom: '0px', marginTop: '10px' }}
                      InputLabelProps={{
                        shrink: true, // Forces the label to shrink
                      }}
                    />

        </div>
        <div style={{ marginBottom: "12px" }}>
        <Typography variant="body1" gutterBottom sx={{ marginTop: '20px' }}>
          Number of genes: {knnValue}
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
        </div>

        <button type="submit" className="colorpicker" style={{ 
          marginTop: '0px', 
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding: "8px 16px",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer",
          backgroundColor: loading ? "#eeeeee" : "",
          color:  loading ? "#888888" : "#ffffff",
          }}>
          {loading ? (
            <>
              <Spinner /> <span style={{ marginLeft: "8px" }}>Loading...</span>
            </>
          ) : (
            "Search marker genes"
          )}
        </button>
      </form>
      
    </div>
  );
};