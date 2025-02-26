import React, { useState } from "react";
import { DiffTable } from "./diffgenetable";
import { Slider, Typography, TextField } from '@mui/material';

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

function getTopKGenes(json, k) {
  const genesArray = Array.isArray(json.genes) ? json.genes : Array.from(json.genes);
  const sortedGenes = genesArray.sort((a, b) => b.t - a.t);
  const topKGeneNames = sortedGenes.slice(0, k).map(item => item.gene);
  return topKGeneNames;
}

export const DiffExpQuery = ({ setNewGeneSearchResult, species }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [meta, setMeta] = useState("");
  const [knnValue, setKnnValue] = useState(500);
  const [warning, setWarning] = useState(""); // New state for warning message

  const handleSliderChange = (event, newValue) => {
    setKnnValue(newValue);
  };

  const writeLog = async () => {
    try {
      const response = await fetch('https://archs4.org/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "category": "markergenes", "entry": meta }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error writing log:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if search term is empty
    if (!meta.trim()) {
      setWarning("Please enter a search term before searching.");
      return;
    }

    setWarning(""); // Clear warning if there’s a search term
    setLoading(true);
    setResult(null);
    writeLog();

    const url = "https://maayanlab.cloud/sigpy/data/diffexp";
    const payload = {
      meta: meta,
      fdr_cutoff: 0.01,
      species: species["species"],
      k: knnValue,
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`);
      }

      let json = await res.json();
      json["species"] = species;
      json["query"] = meta;

      let genes = getTopKGenes(json, knnValue);
      json["genes"] = genes;
      console.log("ww", json);

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
      <p>
        Find genes that are upregulated in selected cellular context compared to a randomized background. 100 samples matching the search term and 100 random samples are extracted from ARCHS4. Differential gene expression is computed and the {knnValue} genes that are upregulated are returned.
      </p>
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
              shrink: true,
            }}
          />
        </div>
        {warning && (
          <Typography variant="body2" color="error" sx={{ marginBottom: '12px' }}>
            {warning}
          </Typography>
        )}
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

        <button
          type="submit"
          className="colorpicker"
          disabled={loading} // Disable button while loading
          style={{
            marginTop: '0px',
            width: "100%",
            display: "flex",
            justifyContent: "center", // Center horizontally
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
            "Search marker genes"
          )}
        </button>
      </form>
    </div>
  );
};