import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { HexColorPicker } from 'react-colorful';
import { ExpressionDownload } from './expressiondownload';
import enrichricon from '../../../image/dna_red.png';

// Utility function to lighten a hex color
const lightenColor = (color, percent) => {
  const num = parseInt(color.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;

  return "#" + (0x1000000 + 
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + 
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1).toUpperCase();
};

const QueryRow = ({ queryKey, queryValue, downloadQueryGenes, removeQueryFromHistory, changeColor }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(queryValue.color);
  const [isFading, setIsFading] = useState(false); // New state for fading
  const lighterColor = lightenColor(currentColor, 60);

  const setPickerOpenWrapper = (species, searchterm, opened) => {
    setPickerOpen(opened);
    changeColor(species, searchterm, currentColor);
  };

  const handleSendToEnrichr = () => {
    const genes = Array.from(queryValue.genes).join('\n');
    send_to_Enrichr(genes, "ARCHS4 "+queryKey, true);
  };

  const handleRemove = (e) => {
    e.preventDefault();
    setIsFading(true); // Trigger fade-out
  };

  useEffect(() => {
    if (isFading) {
      // After fade-out animation (e.g., 300ms), call the actual removal
      const timer = setTimeout(() => {
        removeQueryFromHistory(queryValue.species, queryKey);
      }, 300); // Match this with CSS transition duration
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [isFading, queryValue.species, queryKey, removeQueryFromHistory]);

  function send_to_Enrichr(genes, description = "Gene list from ARCHS4", popup = true) {
    if (!genes) {
      alert("No genes defined.");
      return;
    }
    
    const form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "https://maayanlab.cloud/Enrichr/enrich");
    if (popup) {
      form.setAttribute("target", "_blank");
    }
    form.setAttribute("enctype", "multipart/form-data");
  
    const listField = document.createElement("input");
    listField.setAttribute("type", "hidden");
    listField.setAttribute("name", "list");
    listField.setAttribute("value", genes);
    form.appendChild(listField);
  
    const descField = document.createElement("input");
    descField.setAttribute("type", "hidden");
    descField.setAttribute("name", "description");
    descField.setAttribute("value", description);
    form.appendChild(descField);
  
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }
  
  return (
    <tr
      className="queryrow"
      key={queryKey}
      style={{
        borderBottom: "1px solid #ddd",
        opacity: isFading ? 0 : 1, // Fade out when isFading is true
        transition: "opacity 0.3s ease-in-out", // Smooth fade effect
      }}
    >
      <td style={{ padding: "5px" }}>
        <div
          onClick={() => setPickerOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            border: '1px solid #ccc',
            width: '40px',
            padding: '2px',
            borderRadius: '3px',
            transition: 'background-color 0.3s',
            backgroundColor: isHovered ? lighterColor : "white",
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: currentColor,
              borderRadius: '3px'
            }}
          ></div>
          <div style={{ marginLeft: 'auto', fontSize: '12px' }}>▼</div>
        </div>

        {isPickerOpen && (
          <div style={{
            position: 'absolute',
            zIndex: 1000,
            background: 'white',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)'
          }}>
            <HexColorPicker color={currentColor} onChange={setCurrentColor} />
            <button
              className="colorpicker"
              onClick={() => setPickerOpenWrapper(queryValue.species, queryKey, false)}
              style={{ marginTop: '10px' }}
            >
              Select
            </button>
          </div>
        )}
      </td>
      <td style={{ padding: "5px" }}><strong>{queryKey}</strong></td>
      <td style={{ padding: "5px" }}>{queryValue.species}</td>
      <td style={{ padding: "5px" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); downloadQueryGenes(queryValue.species, queryKey); }}>
          {queryValue.genes.size}
        </a>
      </td>
      <td style={{ padding: "5px" }}>
        <img
          src={enrichricon}
          alt="Enrichr icon"
          style={{ width: "22px", cursor: "pointer", marginBottom: "-6px" }}
          onClick={handleSendToEnrichr}
        />
      </td>
      <td style={{ padding: "5px" }}>
        <a href="#" onClick={handleRemove}>
          <FontAwesomeIcon style={{ color: 'black' }} icon={faXmark} />
        </a>
      </td>
    </tr>
  );
};

export const QueryTableGene = ({ searchHistory, speciesSelection, downloadQueryGenes, removeQueryFromHistory, changeColor }) => {
  console.log(searchHistory[speciesSelection]);
  return (
    <div style={{ width: "100%", backgroundColor: "white", padding: "6px" }}>
      <table style={{ width: "100%", borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr className="querytableheader" style={{ textAlign: 'left' }}>
            <th style={{ padding: "5px" }}></th>
            <th style={{ padding: "5px" }}>Description</th>
            <th style={{ padding: "5px" }}>Organism</th>
            <th style={{ padding: "5px" }}>Genes</th>
            <th style={{ padding: "5px" }}>Enrichr</th>
            <th style={{ padding: "5px" }}>Remove</th>
          </tr>
        </thead>
        <tbody>
          {searchHistory[speciesSelection] && 
            Object.entries(searchHistory[speciesSelection]).map(([key, value]) => (
              <QueryRow 
                key={key} 
                queryKey={key} 
                queryValue={value} 
                downloadQueryGenes={downloadQueryGenes} 
                removeQueryFromHistory={removeQueryFromHistory}
                changeColor={changeColor}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
};