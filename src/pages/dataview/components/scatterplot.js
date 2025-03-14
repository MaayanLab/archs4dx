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
  const [isSampleView, setIsSampleView] = useState(true);

  // Validate and load search history from localStorage
  const loadFromStorage = () => {
    const storedData = localStorage.getItem("searchHistory");
    let initialData;

    try {
      if (!storedData) {
        throw new Error("No stored data");
      }
      
      initialData = JSON.parse(storedData);
      
      // Basic structure validation
      if (!initialData?.sample || !initialData?.gene) {
        throw new Error("Invalid structure");
      }
      
      // Validate species structure
      if (!initialData.sample.human || !initialData.sample.mouse ||
          !initialData.gene.human || !initialData.gene.mouse) {
        throw new Error("Missing species data");
      }

      // Convert sample arrays to Sets of integers
      for (const sp in initialData.sample) {
        for (const key in initialData.sample[sp]) {
          if (initialData.sample[sp].hasOwnProperty(key)) {
            // Validate samples is an array
            if (!Array.isArray(initialData.sample[sp][key].samples)) {
              throw new Error("Invalid samples format");
            }
            initialData.sample[sp][key].samples = new Set(
              initialData.sample[sp][key].samples
            );
          }
        }
      }

      // Convert gene arrays to Sets
      for (const sp in initialData.gene) {
        for (const key in initialData.gene[sp]) {
          if (initialData.gene[sp].hasOwnProperty(key)) {
            // Validate genes is an array
            if (!Array.isArray(initialData.gene[sp][key].genes)) {
              throw new Error("Invalid genes format");
            }
            initialData.gene[sp][key].genes = new Set(
              initialData.gene[sp][key].genes
            );
          }
        }
      }
    } catch (error) {
      console.error("Corrupted search history detected, resetting localStorage:", error);
      // Reset to default structure
      initialData = { sample: { human: {}, mouse: {} }, gene: { human: {}, mouse: {} } };
      localStorage.removeItem("searchHistory");
    }

    return initialData;
  };

  const [searchHistory, setSearchHistory] = useState(loadFromStorage());

  // Update isSampleView based on sampleMode prop
  useEffect(() => {
    setIsSampleView(sampleMode === "sample");
  }, [sampleMode]);

  // Update species selection when speciesMode changes
  useEffect(() => {
    setSpeciesSelection(speciesMode);
  }, [speciesMode]);

  // Fetch samples for a new query if not in history
  useEffect(() => {
    if (query && !searchHistory.sample[speciesSelection].hasOwnProperty(query)) {
      searchSamples(query);
    }
  }, [query]);

  // Handle new sample search result
  useEffect(() => {
    if (newSearchResult) {
      const numberOfQueries = Object.keys(
        searchHistory.sample[speciesSelection]
      ).length;
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
  }, [newSearchResult]);

  // Handle new gene search result
  useEffect(() => {
    if (newGeneSearchResult) {
      const numberOfQueries = Object.keys(
        searchHistory.gene[speciesSelection]
      ).length;
      if (
        !searchHistory.gene[speciesSelection].hasOwnProperty(
          newGeneSearchResult.query
        )
      ) {
        setSearchHistory((prevHistory) => ({
          ...prevHistory,
          gene: {
            ...prevHistory.gene,
            [speciesSelection]: {
              ...prevHistory.gene[speciesSelection],
              [newGeneSearchResult.query]: {
                genes: new Set(newGeneSearchResult.genes),
                color: colorOptions[numberOfQueries % colorOptions.length],
                species: newGeneSearchResult.species,
              },
            },
          },
        }));
      }
    }
  }, [newGeneSearchResult]);

  // Toggle between 2D and 3D
  const toggleScatterDimensionality = () => {
    setIs3D((prev) => !prev);
  };

  // Fetch embedding CSV data
  const fetchData = async () => {
    try {
      const url = `https://s3.dev.maayanlab.cloud/archs4/files/${speciesSelection}_embedding_${isSampleView ? "samples" : "genes"}_${is3D ? "3d" : "2d"}.csv.gz`;
      const response = await fetch(url);
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

      const arrayBuffer = new Uint8Array(receivedBytes);
      let position = 0;
      for (let chunk of chunks) {
        arrayBuffer.set(chunk, position);
        position += chunk.length;
      }

      const decompressed = pako.inflate(arrayBuffer, { to: "string" });
      const rows = decompressed.trim().split("\n");
      const totalRows = rows.length;
      const chunkSize = 100000;

      let dataChunk = [];
      for (let start = 0; start < totalRows; start += chunkSize) {
        const chunk = rows.slice(start, start + chunkSize).map((row) => {
          const columns = row.split(",");
          const firstColumn = isSampleView
            ? parseInt(columns[0], 10)
            : columns[0];
          return [firstColumn, ...columns.slice(1).map(Number)];
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

  // Deep clone utility with Set handling
  const deepCloneWithSetHandling = (obj) => {
    if (obj === null || typeof obj !== "object") return obj;
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

  // Prepare searchHistory for storage
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

  // Save to localStorage and update scatter plot colors
  useEffect(() => {
    try {
      localStorage.setItem("searchHistory", JSON.stringify(prepareForStorage()));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
    if (sampleMode === "sample") {
      updateScatterPlotColors();
    } else {
      updateScatterPlotGeneColors();
    }
  }, [searchHistory, sampleMode]);

  // Fetch samples for a query
  const searchSamples = async (query) => {
    try {
      const numberOfQueries = Object.keys(
        searchHistory.sample[speciesSelection]
      ).length;
      setSearchHistory((prevHistory) => ({
        ...prevHistory,
        sample: {
          ...prevHistory.sample,
          [speciesSelection]: {
            ...prevHistory.sample[speciesSelection],
            [query]: {
              samples: new Set(),
              series_count: "Loading...",
              species: speciesSelection,
              color: colorOptions[numberOfQueries % colorOptions.length],
              isLoading: true,
            },
          },
        },
      }));

      const response = await fetch(
        `https://maayanlab.cloud/sigpy/meta/quicksearch?query=${query}&species=${speciesSelection}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();

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
              isLoading: false,
            },
          },
        },
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
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

  // Update sample query color
  const changeColor = (species, query, color) => {
    setSearchHistory((prevHistory) => {
      const speciesHistory = { ...prevHistory.sample[species] };
      if (speciesHistory[query]) {
        speciesHistory[query] = { ...speciesHistory[query], color };
      }
      return {
        ...prevHistory,
        sample: { ...prevHistory.sample, [species]: speciesHistory },
      };
    });
    updateScatterPlotColors();
  };

  // Update gene query color
  const changeGeneColor = (species, query, color) => {
    setSearchHistory((prevHistory) => {
      const speciesHistory = { ...prevHistory.gene[species] };
      if (speciesHistory[query]) {
        speciesHistory[query] = { ...speciesHistory[query], color };
      }
      return {
        ...prevHistory,
        gene: { ...prevHistory.gene, [species]: speciesHistory },
      };
    });
    updateScatterPlotGeneColors();
  };

  // Remove sample query from history
  const removeQueryFromHistory = (species, query) => {
    setSearchHistory((prevHistory) => {
      const speciesHistory = { ...prevHistory.sample[species] };
      delete speciesHistory[query];
      return {
        ...prevHistory,
        sample: { ...prevHistory.sample, [species]: speciesHistory },
      };
    });
    updateScatterPlotColors();
  };

  // Remove gene query from history
  const removeGeneQueryFromHistory = (species, query) => {
    setSearchHistory((prevHistory) => {
      const speciesHistory = { ...prevHistory.gene[species] };
      delete speciesHistory[query];
      return {
        ...prevHistory,
        gene: { ...prevHistory.gene, [species]: speciesHistory },
      };
    });
    updateScatterPlotGeneColors();
  };

  // Download sample IDs
  const downloadQuerySamples = (species, query) => {
    if (
      !searchHistory?.sample[species] ||
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
    } catch (error) {
      console.error("Error creating download:", error);
    }
  };

  // Download gene IDs
  const downloadQueryGenes = (species, query) => {
    if (
      !searchHistory?.gene[species] ||
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
    } catch (error) {
      console.error("Error creating download:", error);
    }
  };

  // Update scatter plot colors for sample mode
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

  // Update scatter plot colors for gene mode
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

  // Three.js rendering and controls
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
      controls.enableRotate = is3D;
      controls.enablePan = !is3D;

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

      if (sampleMode === "sample") {
        updateScatterPlotColors();
      } else {
        updateScatterPlotGeneColors();
      }

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
          normalPointsRef.current.position.x += deltaX * moveFactor / zoomFactor;
          normalPointsRef.current.position.y -= deltaY * moveFactor / zoomFactor;
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
        renderer.domElement.removeEventListener("mousedown", handleMouseDown);
        renderer.domElement.removeEventListener("mousemove", handleMouseMove);
        renderer.domElement.removeEventListener("mouseup", handleMouseUp);
        if (normalPointsRef.current) {
          normalPointsRef.current.geometry.dispose();
          normalPointsRef.current.material.dispose();
          scene.remove(normalPointsRef.current);
        }
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

      <div>
        {sampleMode === "sample" ? (
          <QueryTable
            searchHistory={searchHistory.sample}
            speciesSelection={speciesSelection}
            downloadQuerySamples={downloadQuerySamples}
            removeQueryFromHistory={removeQueryFromHistory}
            changeColor={changeColor}
          />
        ) : (
          <QueryTableGene
            searchHistory={searchHistory.gene}
            speciesSelection={speciesSelection}
            downloadQueryGenes={downloadQueryGenes}
            removeQueryFromHistory={removeGeneQueryFromHistory}
            changeColor={changeGeneColor}
          />
        )}
      </div>
    </div>
  );
};