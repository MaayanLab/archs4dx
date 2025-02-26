"use strict";
import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Button, Switch, FormControlLabel, Typography } from "@mui/material";
import pako from "pako";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { QueryTable } from "./querytable";
import { QueryTableGene } from "./querytablegene";

export const ScatterPlot = ({
  sampleMode,
  speciesMode,
  query,
  newSearchResult,
  newGeneSearchResult,
}) => {
  const containerRef = useRef();
  const sceneRef = useRef(null);
  const normalPointsRef = useRef(null);
  const isDragging = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const colorOptions = [
    "#ffc700",
    "#099DD7",
    "#dd33dd",
    "#248E84",
    "#F2583F",
    "#96503F",
  ];

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [speciesSelection, setSpeciesSelection] = useState("human");
  const [progress, setProgress] = useState(0);
  const [is3D, setIs3D] = useState(true);
  // isSampleView will determine which CSV file to load
  const [isSampleView, setIsSampleView] = useState(true);

  // Load the search history from localStorage.
  // The expected structure is:
  // {
  //   sample: { human: {}, mouse: {} },
  //   gene: { human: {}, mouse: {} }
  // }

  localStorage.setItem("searchHistory", JSON.stringify({"gene": {"mouse": {}, "human": {}}, "sample": {"mouse": {}, "human": {}}}));


  const loadFromStorage = () => {
    const storedData = localStorage.getItem("searchHistory");
    const initialData = storedData
      ? JSON.parse(storedData)
      : { sample: { human: {}, mouse: {} }, gene: { human: {}, mouse: {} } };

    // Convert arrays stored into sets for sample queries.
    if (initialData.sample) {
      for (const sp in initialData.sample) {
        for (const key in initialData.sample[sp]) {
          if (initialData.sample[sp].hasOwnProperty(key)) {
            initialData.sample[sp][key].samples = new Set(
              initialData.sample[sp][key].samples
            );
          }
        }
      }
    }
    // Convert arrays stored into sets for gene queries.
    if (initialData.gene) {
      for (const sp in initialData.gene) {
        for (const key in initialData.gene[sp]) {
          if (initialData.gene[sp].hasOwnProperty(key)) {
            initialData.gene[sp][key].genes = new Set(
              initialData.gene[sp][key].genes
            );
          }
        }
      }
    }
    return initialData;
  };

  const [searchHistory, setSearchHistory] = useState(loadFromStorage());

  // Update the isSampleView based on sampleMode prop.
  useEffect(() => {
    if (sampleMode === "sample") {
      setIsSampleView(true);
    } else {
      setIsSampleView(false);
    }
  }, [sampleMode]);

  // Update species selection when speciesMode changes.
  useEffect(() => {
    setSpeciesSelection(speciesMode);
  }, [speciesMode]);

  // When a new query is received and not already in the history for current species,
  // Fetch samples.
  useEffect(() => {
    if (query) {
      if (!searchHistory.sample[speciesSelection].hasOwnProperty(query)) {
        searchSamples(query);
      }
    }
  }, [query]);

  // When new sample search result is received, add it if not already in history.
  useEffect(() => {
    if (newSearchResult) {
      const numberOfQueries = Object.keys(
        searchHistory.sample[speciesSelection]
      ).length;
      if (true){
      //if (!searchHistory.sample[speciesSelection].hasOwnProperty(newSearchResult.signame)) {
        setSearchHistory((prevHistory) => ({
          ...prevHistory,
          sample: {
            ...prevHistory.sample,
            [speciesSelection]: {
              ...prevHistory.sample[speciesSelection],
              [newSearchResult.signame]: {
                samples: new Set(
                  newSearchResult.samples.map((sample) =>
                    parseInt(sample.replace("GSM", ""), 10)
                  )
                ),
                series_count: newSearchResult.series_count,
                species: newSearchResult.species,
                color: colorOptions[numberOfQueries % colorOptions.length],
              },
            },
          },
        }));
      }
    }
  }, [newSearchResult]);

  // When new gene search result is received, add it if not already in history.
  useEffect(() => {
    if (newGeneSearchResult) {
      const numberOfQueries = Object.keys(
        searchHistory.gene[speciesSelection]
      ).length;
      if (!searchHistory.gene[speciesSelection].hasOwnProperty(newGeneSearchResult.query)) {
        setSearchHistory((prevHistory) => ({
          ...prevHistory,
          gene: {
            ...prevHistory.gene,
            [speciesSelection]: {
              ...prevHistory.gene[speciesSelection],
              [newGeneSearchResult.query]: {
                genes: new Set(newGeneSearchResult.genes),
                color: colorOptions[numberOfQueries % colorOptions.length],
                species: newGeneSearchResult.species
              },
            },
          },
        }));
      }
    }
  }, [newGeneSearchResult]);

  // Function to toggle between 2D and 3D.
  const toggleScatterDimensionality = () => {
    setIs3D((prev) => !prev);
  };

  // Fetch embedding CSV data.
  const fetchData = async () => {
    try {
      const url = `https://s3.dev.maayanlab.cloud/archs4/files/${speciesSelection}_embedding_${isSampleView ? "samples" : "genes"}_${is3D ? "3d" : "2d"}.csv.gz`;
      const response = await fetch(url);

      // Get content length for progress estimation.
      const contentLength = response.headers.get("Content-Length");
      const reader = response.body.getReader();
      const totalBytes = parseInt(contentLength, 10);

      let receivedBytes = 0;
      let chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedBytes += value.length;
        if (totalBytes) {
          setProgress((receivedBytes / totalBytes) * 100);
        }
      }

      // Concatenate chunks.
      const arrayBuffer = new Uint8Array(receivedBytes);
      let position = 0;
      for (let chunk of chunks) {
        arrayBuffer.set(chunk, position);
        position += chunk.length;
      }

      // Decompress CSV.
      const decompressed = pako.inflate(arrayBuffer, { to: "string" });
      const rows = decompressed.trim().split("\n");
      const totalRows = rows.length;
      const chunkSize = 100000;

      let dataChunk = [];

      // Process CSV in chunks.
      for (let start = 0; start < totalRows; start += chunkSize) {
        const chunk = rows.slice(start, start + chunkSize).map((row) => {
          const columns = row.split(",");
          // For samples: first column is number, for genes: it could be a string.
          const firstColumn = isSampleView
            ? parseInt(columns[0], 10)
            : columns[0];
          return [firstColumn, ...columns.slice(1).map(Number)];
        });
        dataChunk = [...dataChunk, ...chunk];
        setData(dataChunk);
        // Let UI breathe.
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      setLoading(false);
    }
    catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  // Trigger data fetch when dependencies change.
  useEffect(() => {
    fetchData();
  }, [speciesSelection, is3D, isSampleView]);

  // Utility function to deep-clone an object and properly handle Sets.
  const deepCloneWithSetHandling = (obj) => {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    if (obj instanceof Set) return new Set(obj);
    if (Array.isArray(obj))
      return obj.map((item) => deepCloneWithSetHandling(item));
    const clonedObj = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepCloneWithSetHandling(obj[key]);
      }
    }
    return clonedObj;
  };

  // Save searchHistory to localStorage.
  // We need to convert Sets into arrays.
  const prepareForStorage = () => {
    const historyToSave = deepCloneWithSetHandling(searchHistory);
    if (historyToSave.sample) {
      for (const sp in historyToSave.sample) {
        for (const key in historyToSave.sample[sp]) {
          historyToSave.sample[sp][key].samples = Array.from(
            historyToSave.sample[sp][key].samples
          );
        }
      }
    }
    if (historyToSave.gene) {
      for (const sp in historyToSave.gene) {
        for (const key in historyToSave.gene[sp]) {
          historyToSave.gene[sp][key].genes = Array.from(
            historyToSave.gene[sp][key].genes
          );
        }
      }
    }
    return historyToSave;
  };

  // Save to localStorage and update scatter plot colors when searchHistory changes.
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(prepareForStorage()));
    if (sampleMode === "sample") {
      updateScatterPlotColors();
    }
    else {
      updateScatterPlotGeneColors();
    }
  }, [searchHistory, sampleMode]);

  const searchSamples = async (query) => {
    try {
      // Set placeholder/loading state immediately
      const numberOfQueries = Object.keys(searchHistory.sample[speciesSelection]).length;
      setSearchHistory((prevHistory) => ({
        ...prevHistory,
        sample: {
          ...prevHistory.sample,
          [speciesSelection]: {
            ...prevHistory.sample[speciesSelection],
            [query]: {
              samples: new Set(), // Empty set as placeholder
              series_count: "Loading...", // Placeholder text
              species: speciesSelection, // Can use current species as placeholder
              color: colorOptions[numberOfQueries % colorOptions.length],
              isLoading: true, // Optional: flag to indicate loading state
            },
          },
        },
      }));
  
      // Fetch the actual data
      const response = await fetch(
        `https://maayanlab.cloud/sigpy/meta/quicksearch?query=${query}&species=${speciesSelection}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const responseData = await response.json();
  
      // Overwrite placeholder with real data
      setSearchHistory((prevHistory) => ({
        ...prevHistory,
        sample: {
          ...prevHistory.sample,
          [speciesSelection]: {
            ...prevHistory.sample[speciesSelection],
            [query]: {
              samples: new Set(
                responseData.samples.map((sample) =>
                  parseInt(sample.replace("GSM", ""), 10)
                )
              ),
              series_count: responseData.series_count,
              species: responseData.species,
              color: colorOptions[numberOfQueries % colorOptions.length],
              isLoading: false, // Optional: clear loading flag
            },
          },
        },
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optional: Update state to show error
      setSearchHistory((prevHistory) => ({
        ...prevHistory,
        sample: {
          ...prevHistory.sample,
          [speciesSelection]: {
            ...prevHistory.sample[speciesSelection],
            [query]: {
              ...prevHistory.sample[speciesSelection][query],
              samples: new Set(),
              series_count: "Error loading data",
              isLoading: false,
            },
          },
        },
      }));
    }
  };

  // Update a sample query's color.
  const changeColor = (species, query, color) => {
    setSearchHistory((prevHistory) => {
      const speciesHistory = { ...prevHistory.sample[species] };
      if (speciesHistory[query]) {
        speciesHistory[query] = { ...speciesHistory[query], color: color };
      }
      return {
        ...prevHistory,
        sample: {
          ...prevHistory.sample,
          [species]: speciesHistory,
        },
      };
    });
    updateScatterPlotColors();
  };

  // Update a gene query's color.
  const changeGeneColor = (species, query, color) => {
    setSearchHistory((prevHistory) => {
      const speciesHistory = { ...prevHistory.gene[species] };
      if (speciesHistory[query]) {
        speciesHistory[query] = { ...speciesHistory[query], color: color };
      }
      return {
        ...prevHistory,
        gene: {
          ...prevHistory.gene,
          [species]: speciesHistory,
        },
      };
    });
    updateScatterPlotGeneColors();
  };

  // Remove a sample query from the history.
  const removeQueryFromHistory = (species, query) => {
    setSearchHistory((prevHistory) => {
      const speciesHistory = { ...prevHistory.sample[species] };
      delete speciesHistory[query];
      return {
        ...prevHistory,
        sample: {
          ...prevHistory.sample,
          [species]: speciesHistory,
        },
      };
    });
    updateScatterPlotColors();
  };

  // Remove a gene query from the history.
  const removeGeneQueryFromHistory = (species, query) => {
    setSearchHistory((prevHistory) => {
      const speciesHistory = { ...prevHistory.gene[species] };
      delete speciesHistory[query];
      return {
        ...prevHistory,
        gene: {
          ...prevHistory.gene,
          [species]: speciesHistory,
        },
      };
    });
    updateScatterPlotGeneColors();
  };

  // Download sample IDs for a given sample query.
  const downloadQuerySamples = (species, query) => {
    if (
      !searchHistory ||
      !searchHistory.sample[species] ||
      !(query in searchHistory.sample[species])
    ) {
      console.error(`No data available for query: ${query}`);
      return;
    }
    const samples = searchHistory.sample[species][query]?.samples;
    if (!(samples instanceof Set)) {
      console.error("Samples should be an instance of Set");
      return;
    }
    try {
      const dataStr = Array.from(samples)
        .map((sample) => `GSM${sample}`)
        .join("\n");
      const blob = new Blob([dataStr], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${query}_samples.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }
    catch (error) {
      console.error("An error occurred while creating the download:", error);
    }
  };

  // Download gene IDs for a given gene query.
  const downloadQueryGenes = (species, query) => {
    if (
      !searchHistory ||
      !searchHistory.gene[species] ||
      !(query in searchHistory.gene[species])
    ) {
      console.error(`No data available for query: ${query}`);
      return;
    }
    const genes = searchHistory.gene[species][query]?.genes;
    if (!(genes instanceof Set)) {
      console.error("Genes should be an instance of Set");
      return;
    }
    try {
      const dataStr = Array.from(genes).join("\n");
      const blob = new Blob([dataStr], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${query}_genes.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }
    catch (error) {
      console.error("An error occurred while creating the download:", error);
    }
  };

  // Update scatter plot colors for sample mode.
  const updateScatterPlotColors = () => {
    if (!normalPointsRef.current) return;
    const colors = [];
    const sizes = [];
    data.forEach((d) => {
      const gsm = d[0];
      let color = new THREE.Color("#000000");
      let size = 0.1;
      for (const key in searchHistory.sample[speciesSelection]) {
        const queryData = searchHistory.sample[speciesSelection][key];
        if (queryData.samples.size > 0 && queryData.samples.has(gsm)) {
          color = new THREE.Color(queryData.color);
          size = 0.6;
          break;
        }
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

  // Update scatter plot colors for gene mode.
  const updateScatterPlotGeneColors = () => {
    if (!normalPointsRef.current) return;
    const colors = [];
    const sizes = [];
    data.forEach((d) => {
      const gene = d[0];
      let color = new THREE.Color("#000000");
      let size = 0.1;
      for (const key in searchHistory.gene[speciesSelection]) {
        const queryData = searchHistory.gene[speciesSelection][key];
        if (queryData.genes.size > 0 && queryData.genes.has(gene)) {
          color = new THREE.Color(queryData.color);
          size = 0.6;
          break;
        }
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

  // Three.js rendering and controls.
  useEffect(() => {
    if (!loading) {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
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
      }
      else {
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
      }
      else {
        controls.enableRotate = false;
      }

      // Prepare points geometry.
      const pointGeo = new THREE.BufferGeometry();
      const positions = [];
      const colorsArray = [];

      data.forEach((d) => {
        const x = d[1];
        const y = d[2];
        const z = d[3];
        positions.push(x, y, z);
        const col = new THREE.Color(0, 0, 0);
        colorsArray.push(col.r, col.g, col.b);
      });

      pointGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
      pointGeo.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colorsArray, 3)
      );

      const mat = new THREE.PointsMaterial({
        vertexColors: true,
        sizeAttenuation: true,
        size: 0.01,
      });

      const points = new THREE.Points(pointGeo, mat);
      scene.add(points);
      normalPointsRef.current = points;

      // Call the appropriate update function.
      if (sampleMode === "sample") {
        updateScatterPlotColors();
      }
      else {
        updateScatterPlotGeneColors();
      }

      // Mouse events for 2D panning.
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
          const moveFactor = 0.01;
          let adjustedMoveFactorX = (deltaX * moveFactor) / zoomFactor;
          let adjustedMoveFactorY = (deltaY * moveFactor) / zoomFactor;
          normalPointsRef.current.position.x += adjustedMoveFactorX;
          normalPointsRef.current.position.y -= adjustedMoveFactorY;
          lastMousePosition.current = { x: event.clientX, y: event.clientY };
        }
      };

      const handleZoom = () => {
        if (!is3D) {
          const scaleFactor = 0.2 * camera.zoom;
          mat.size = scaleFactor;
        }
      };

      controls.addEventListener("change", handleZoom);
      renderer.domElement.addEventListener("mousedown", handleMouseDown);
      renderer.domElement.addEventListener("mousemove", handleMouseMove);
      renderer.domElement.addEventListener("mouseup", handleMouseUp);

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        controls.removeEventListener("change", handleZoom);
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
  }, [loading, data, is3D, searchHistory, sampleMode]);

  return (
    <div
      style={{
        marginLeft: "-5px",
        marginTop: "-10px",
        position: "relative",
        width: "700px",
        height: "700px",
      }}
    >
      {loading ? (
        <Box sx={{ width: "100%", textAlign: "center", height: "700px" }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      ) : (
        <>
          <div ref={containerRef} style={{ width: "100%", height: "80%" }} />
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingRight: "30px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "right",
                marginRight: "60px",
                width: "100%",
              }}
            >
              <div className="dtoggle">
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: is3D ? "normal" : "bold",
                    color: is3D ? "grey" : "#bf00ff",
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
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "primary.main",
                    },
                    "& .MuiSwitch-track": {
                      backgroundColor: is3D ? "grey" : "#bf00ff",
                    },
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: is3D ? "bold" : "normal",
                    color: is3D ? "primary.main" : "grey",
                  }}
                >
                  3D
                </Typography>
              </div>
            </Box>
          </div>
        </>
      )}

      {/* Render the history table based on the mode */}
      <div>
        {sampleMode === "sample" ? (
          <QueryTable
            searchHistory={searchHistory.sample}
            speciesSelection={speciesSelection}
            downloadQuerySamples={(species, query) =>
              downloadQuerySamples(species, query)
            }
            removeQueryFromHistory={(species, query) =>
              removeQueryFromHistory(species, query)
            }
            changeColor={(species, query, color) =>
              changeColor(species, query, color)
            }
          />
        ) : (
          <QueryTableGene
            searchHistory={searchHistory.gene}
            speciesSelection={speciesSelection}
            downloadQueryGenes={(species, query) =>
              downloadQueryGenes(species, query)
            }
            removeQueryFromHistory={(species, query) =>
              removeGeneQueryFromHistory(species, query)
            }
            changeColor={(species, query, color) =>
              changeGeneColor(species, query, color)
            }
          />
        )}
      </div>
    </div>
  );
};
