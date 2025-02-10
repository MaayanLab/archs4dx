import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Button } from "@mui/material";
import pako from "pako";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { QueryTable } from "./querytable";
import { Switch, FormControlLabel, Typography } from '@mui/material'; 

export const ScatterPlot =  ({ sampleMode, speciesMode, query, newSearchResult }) => {
  const containerRef = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [speciesSelection, setSpeciesSelection] = useState("human");
  const [progress, setProgress] = useState(0);
  const [is3D, setIs3D] = useState(true);
  const [isSampleView, setIsSampleView] = useState(true);
  const sceneRef = useRef(null);

  const loadFromStorage = () => {
    const storedData = localStorage.getItem('searchHistory');
    const initialData = storedData ? JSON.parse(storedData) : { human: {}, mouse: {} };
  
    for (const species in initialData) {
      for (const query in initialData[species]) {
        initialData[species][query].samples = new Set(initialData[species][query].samples);
      }
    }
    return initialData;
  };

  const [searchHistory, setSearchHistory] = useState(loadFromStorage());
  const normalPointsRef = useRef(null);
  const isDragging = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  const colorOptions = ["#ffc700","#099DD7","#dd33dd","#248E84","#F2583F","#96503F"]


  useEffect(() => {
    updateScatterPlotColors();
  }, []);

  useEffect(() => {
    if (query) {
        if (!searchHistory[speciesSelection].hasOwnProperty(query)){
          searchSamples(query); 
        }
    }
  }, [query]);

  useEffect(() => {
    console.log("wait for me");
    console.log(newSearchResult);
    if (newSearchResult) {
      const numberOfQueries = Object.keys(searchHistory[speciesSelection]).length;
      if (!searchHistory[speciesSelection].hasOwnProperty(newSearchResult["signame"])){
        setSearchHistory((prevHistory) => ({
          ...prevHistory,
          [speciesSelection]: {
            ...prevHistory[speciesSelection], // Preserve other queries within the species
            [newSearchResult["signame"]]: {
              samples: new Set(newSearchResult["samples"].map(sample => parseInt(sample.replace("GSM", ""), 10))),
              series_count: newSearchResult["series_count"],
              species: newSearchResult["species"],
              color: colorOptions[numberOfQueries % colorOptions.length]
            }
          }
        }));
      }
    }
  }, [newSearchResult]);

  useEffect(() => {
    if(sampleMode == "sample"){
      setIsSampleView(true)
    }
    else{
      setIsSampleView(false)
    }
  }, [sampleMode]);

  useEffect(() => {
    setSpeciesSelection(speciesMode)
  }, [speciesMode]); 

  const toggleScatterDimensionality = () => {
    setIs3D(!is3D)
  };

   const fetchData = async () => {
    try {
      const response = await fetch(
        `https://s3.dev.maayanlab.cloud/archs4/files/${speciesSelection}_embedding_${isSampleView ? "samples" : "genes"}_${is3D ? "3d" : "2d"}.csv.gz`
      );
      
      // Get the total length from headers if available
      const contentLength = response.headers.get('Content-Length');
      const reader = response.body.getReader();
      const totalBytes = parseInt(contentLength, 10);

      // Download progress
      let receivedBytes = 0;
      let chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedBytes += value.length;

        if (totalBytes) {
          setProgress(((receivedBytes / totalBytes) * 100));
        }
      }

      // Concatenate fetched chunks into one Uint8Array
      const arrayBuffer = new Uint8Array(receivedBytes);
      let position = 0;
      for (let chunk of chunks) {
        arrayBuffer.set(chunk, position);
        position += chunk.length;
      }

      const decompressed = pako.inflate(arrayBuffer, { to: 'string' });
      const rows = decompressed.trim().split("\n");
      const totalRows = rows.length;
      const chunkSize = 100000;

      let dataChunk = [];

      for (let start = 0; start < totalRows; start += chunkSize) {
        const chunk = rows.slice(start, start + chunkSize).map((row) => {
          const columns = row.split(",");
          const firstColumn = isSampleView ? parseInt(columns[0], 10) : columns[0];
          return [
            firstColumn,
            ...columns.slice(1).map(Number),
          ];
        });

        dataChunk = [...dataChunk, ...chunk];
        setData(dataChunk);

        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      setLoading(false);
      
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [speciesSelection, is3D, isSampleView]);

  const deepCloneWithSetHandling = (obj) => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
  
    if (obj instanceof Set) {
      return new Set(obj);
    }
  
    if (Array.isArray(obj)) {
      return obj.map(item => deepCloneWithSetHandling(item));
    }
  
    const clonedObj = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepCloneWithSetHandling(obj[key]);
      }
    }
  
    return clonedObj;
  };

  useEffect(() => {
    const prepareForStorage = () => {
      const historyToSave = deepCloneWithSetHandling(searchHistory);
  
      for (const species in historyToSave) {
        for (const query in historyToSave[species]) {
          historyToSave[species][query].samples = Array.from(historyToSave[species][query].samples);
        }
      }
      return historyToSave;
    };
  
    localStorage.setItem('searchHistory', JSON.stringify(prepareForStorage()));
    updateScatterPlotColors();
  }, [searchHistory]);

  const searchSamples = async (query) => {
    try {
      const response = await fetch(
        `https://maayanlab.cloud/sigpy/meta/quicksearch?query=${query}&species=${speciesSelection}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const numberOfQueries = Object.keys(searchHistory[speciesSelection]).length;
      
      const responseData = await response.json();
      setSearchHistory((prevHistory) => ({
        ...prevHistory,
        [speciesSelection]: {
          ...prevHistory[speciesSelection], // Preserve other queries within the species
          [query]: {
            samples: new Set(responseData["samples"].map(sample => parseInt(sample.replace("GSM", ""), 10))),
            series_count: responseData["series_count"],
            species: responseData["species"],
            color: colorOptions[numberOfQueries % colorOptions.length]
          }
        }
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const changeColor = (species, query, color) => {
    setSearchHistory((prevHistory) => {
      // Clone the current state's species
      const speciesHistory = { ...prevHistory[species] };
      
      // Check if the query exists to avoid errors
      if (speciesHistory[query]) {
        // Update the color for the specific query
        speciesHistory[query] = {
          ...speciesHistory[query],
          color: color,
        };
      }
      
      // Return the updated state
      return {
        ...prevHistory,
        [species]: speciesHistory,
      };
    });
    updateScatterPlotColors();
  };

  const removeQueryFromHistory = (species, query) => {
    setSearchHistory((prevHistory) => {
      const speciesHistory = { ...prevHistory[species] };
      delete speciesHistory[query];
      return {
        ...prevHistory,
        [species]: speciesHistory
      };
    });
    updateScatterPlotColors();
  };

  const downloadQuerySamples = (species, query) => {
    // Ensure searchHistory and species exist before accessing their properties
    if (!searchHistory || !searchHistory[species] || !(query in searchHistory[species])) {
      console.error(`No data available for query: ${query}`);
      return;
    }
  
    // Extract samples and ensure it's an iterable before using spread
    const samples = searchHistory[species][query]?.samples;
    if (!(samples instanceof Set)) {
      console.error('Samples should be an instance of Set');
      return;
    }
  
    try {
      // Format samples with "GSM" prefix, one per line
      const dataStr = Array.from(samples).map(sample => `GSM${sample}`).join('\n');
      
      // Create a new Blob and object URL
      const blob = new Blob([dataStr], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
  
      // Create a temporary link and trigger a download
      const link = document.createElement("a");
      link.href = url;
      link.download = `${query}_samples.txt`;
      document.body.appendChild(link);
      link.click();
  
      // Cleanup: remove the link and revoke the object URL
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('An error occurred while creating the download:', error);
    }
  };

  const updateScatterPlotColors = () => {
    if (!normalPointsRef.current) return;

    const colors = [];
    const sizes = [];
    
    data.forEach((d) => {
      const gsm = d[0];
      let i=0;
      let color = new THREE.Color("#000000");
      let size = 0.1;
      
      for (const query in searchHistory[speciesSelection]) {
        const queryData = searchHistory[speciesSelection][query];
        if (queryData.samples.size > 0 && queryData.samples.has(gsm)) {
          
          color = new THREE.Color(queryData["color"]);
          size = 0.6;
          break;
        }
        i++;
      }

      colors.push(color.r, color.g, color.b);
      sizes.push(size);
      
    });

    normalPointsRef.current.geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    normalPointsRef.current.geometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(sizes, 1)
    );
  };

  useEffect(() => {
    if (!loading) {
      const scene = new THREE.Scene();
      sceneRef.current = scene;
  
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setClearColor(0xffffff);
      containerRef.current.appendChild(renderer.domElement);
  
      let camera, controls;
  
      if (is3D) {
        camera = new THREE.PerspectiveCamera(
          75,
          containerRef.current.clientWidth / containerRef.current.clientHeight,
          0.1,
          500
        );
        camera.position.set(0, 0, 4.5);
      } else {
        const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        const d = 3;
        camera = new THREE.OrthographicCamera(
          -d * aspect,
          d * aspect,
          d,
          -d,
          -100,
          100
        );
        camera.position.set(0, 0, 4.5);
        camera.zoom = 1;
      }
      camera.updateProjectionMatrix();
      camera.lookAt(new THREE.Vector3(0, 0, 0));
  
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.enableZoom = true;
  
      if (is3D) {
        controls.enableRotate = true;
        controls.enablePan = false;
      } else {
        controls.enableRotate = false;
      }
  
      const pointGeo = new THREE.BufferGeometry();
      const positions = [];
      const colors = [];
  
      data.forEach((d) => {
        const x = d[1];
        const y = d[2];
        const z = d[3];
        
        positions.push(x, y, z);
  
        const color = new THREE.Color(0, 0, 0);
        colors.push(color.r, color.g, color.b);
      });
  
      pointGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
      pointGeo.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
      );
  
      const mat = new THREE.PointsMaterial({
        vertexColors: true,
        sizeAttenuation: true,
        size: 0.01,
      });
  
      const points = new THREE.Points(pointGeo, mat);
      scene.add(points);
      normalPointsRef.current = points;
  
      // Call updateScatterPlotColors to apply existing search history colors
      updateScatterPlotColors();
  
      const handleMouseDown = (event) => {
        if (!is3D) {
          isDragging.current = true;
          lastMousePosition.current = { x: event.clientX, y: event.clientY };
        }
      };
  
      const handleMouseUp = () => {
        isDragging.current = false;
      };
  
      const handleMouseMove = (event) => {
        if (!is3D && isDragging.current && normalPointsRef.current) {
          const deltaX = event.clientX - lastMousePosition.current.x;
          const deltaY = event.clientY - lastMousePosition.current.y;
      
          const zoomFactor = camera.zoom;
          const moveFactor = 0.01; // Adjust based on your scene scale
      
          // Compute world-space movement given the UI-space delta
          let adjustedMoveFactorX = deltaX * moveFactor / zoomFactor;
          let adjustedMoveFactorY = deltaY * moveFactor / zoomFactor;
      
          // Update position
          normalPointsRef.current.position.x += adjustedMoveFactorX;
          normalPointsRef.current.position.y -= adjustedMoveFactorY;
          
          // Store the current position as the last one
          lastMousePosition.current = { x: event.clientX, y: event.clientY };
        }
      };
  
      const handleZoom = () => {
        if (!is3D) {
          const scaleFactor = 0.2 * camera.zoom;
          mat.size = scaleFactor;
        }
      };
  
      controls.addEventListener('change', handleZoom);
  
      renderer.domElement.addEventListener("mousedown", handleMouseDown);
      renderer.domElement.addEventListener("mousemove", handleMouseMove);
      renderer.domElement.addEventListener("mouseup", handleMouseUp);
  
      const animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
  
      return () => {
        controls.removeEventListener('change', handleZoom);
        controls.dispose();
        renderer.dispose();
        renderer.domElement.removeEventListener("mousedown", handleMouseDown);
        renderer.domElement.removeEventListener("mousemove", handleMouseMove);
        renderer.domElement.removeEventListener("mouseup", handleMouseUp);
  
        if (normalPointsRef.current) {
          normalPointsRef.current.geometry.dispose();
          normalPointsRef.current.material.dispose();
          scene.remove(normalPointsRef.current);
        }
        
        controls.dispose();
        renderer.dispose();
  
        if (containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
        scene.children.forEach((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
          scene.remove(child);
        });
      };
    }
  }, [loading, data, is3D, searchHistory]); 

  return (
    <div style={{ marginLeft: "-5px", marginTop: "-10px", position: 'relative', width: '700px', height: '700px' }}>
        
      {loading ? (
        
        <Box sx={{ width: '100%', textAlign: 'center',  height: "700px" }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      ) : (
        <>
        <div ref={containerRef} style={{ width: "100%", height: "80%" }} />
        <div style={{ position: "relative",  width: "100%", paddingRight: "30px"}}>
        
        <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'right',
        marginRight: '60px',
        width: '100%'
      }}
    >
      <div class="dtoggle">
      <Typography
        variant="body1"
        sx={{
          fontWeight: is3D ? 'normal' : 'bold',  // Make the 2D label bold when selected
          color: is3D ? 'grey' : '#bf00ff' // Change color based on is3D state
        }}
      >
        2D
      </Typography>
      <Switch
        checked={is3D}
        onChange={toggleScatterDimensionality}
        color="primary"
        sx={{
          mx: 1,
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: 'primary.main',
          },
          '& .MuiSwitch-track': {
            backgroundColor: is3D ? 'grey' : '#bf00ff', // Custom color when in 2D state
          },
        }}
      />
      <Typography
        variant="body1"
        sx={{
          fontWeight: is3D ? 'bold' : 'normal', // Make the 3D label bold when selected
          color: is3D ? 'primary.main' : 'grey' // Change color based on is3D state
        }}
      >
        3D
      </Typography>
      </div>
    </Box>
    


      </div>
      </>
      )}

      <div>
      <QueryTable 
        searchHistory={searchHistory} 
        speciesSelection={speciesSelection} 
        downloadQuerySamples={downloadQuerySamples} 
        removeQueryFromHistory={removeQueryFromHistory}
        changeColor={changeColor}
      />
      </div>


    </div>
  );
};