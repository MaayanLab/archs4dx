import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import domToImage from 'dom-to-image';
import { saveAs } from 'file-saver';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import "./dendrogram.css";

export const Dendrogram = ({ species, gene, type }) => {
  const svgRef = useRef();
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('svg'); // Default to SVG

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFormatSelect = (format) => {
    setSelectedFormat(format);
    saveAsImage(format);
    handleClose();
  };

  const saveAsImage = (format) => {
    const svgElement = svgRef.current.querySelector('svg');
    if (!svgElement) return;

    if (format === 'svg') {
      // Clone the SVG to avoid modifying the original
      const svgClone = svgElement.cloneNode(true);

      // Inline CSS styles
      const styleSheets = Array.from(document.styleSheets)
        .filter(sheet => sheet.href && sheet.href.includes('dendrogram.css') || !sheet.href); // Include local stylesheets
        
      if (styleSheets.length > 0) {
        const relevantClasses = ['link', 'node', 'node--internal', 'node--leaf', 'shadow', 'line', 'xAxis', 'grid'];
        const cssRules = [];
        
        styleSheets.forEach(sheet => {
          try {
            const rules = Array.from(sheet.cssRules || []);
            rules.forEach(rule => {
              if (rule.selectorText && relevantClasses.some(cls => rule.selectorText.includes(cls))) {
                cssRules.push(rule.cssText);
              }
            });
          } catch (e) {
            console.warn('Could not access some CSS rules:', e);
          }
        });

        if (cssRules.length > 0) {
          const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
          styleElement.textContent = cssRules.join('\n');
          svgClone.insertBefore(styleElement, svgClone.firstChild);
        }
      }

      // Add XML declaration and DOCTYPE
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svgClone);
      svgString = '<?xml version="1.0" standalone="no"?>\n' +
                  '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
                  svgString;

      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      saveAs(svgBlob, `dendrogram_${gene}_${species}_${type}.svg`);
    } else if (format === 'png') {
      // Save as PNG using dom-to-image
      domToImage
        .toPng(svgElement, {
          bgcolor: window.getComputedStyle(document.body).backgroundColor || '#ffffff',
          width: parseInt(svgElement.getAttribute('width')),
          height: parseInt(svgElement.getAttribute('height')),
          quality: 1.0,
          style: {
            'transform': 'none',
            'position': 'static'
          }
        })
        .then(dataUrl => {
          fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
              saveAs(blob, `dendrogram_${gene}_${species}_${type}.png`);
            });
        })
        .catch(err => {
          console.error('Error saving PNG:', err);
        });
    }
  };

  useEffect(() => {
    const drawDendrogram = () => {
      setLoading(true);

      const svgId = type === 'tissue' ? 'cellline' : 'tissue';
      const svgElement = d3.select(svgRef.current);
      svgElement.selectAll("*").remove();

      const fullHeight = 1000;
      const compactHeight = 200;
      const width = 1000;

      const svg = svgElement.append("svg")
        .attr("id", svgId)
        .attr("width", width)
        .attr("height", fullHeight)
        .attr("xmlns", "http://www.w3.org/2000/svg");

      svg.append("text")
        .attr("x", width / 2)
        .attr("y", fullHeight / 2)
        .attr("text-anchor", "middle")
        .text("Loading dendrogram...");

      const g = svg.append("g")
        .attr("transform", "translate(50,30)");

      const xScale = d3.scaleLinear()
        .domain([0, 16])
        .range([60, 260]);

      const xAxis = d3.axisTop()
        .scale(xScale)
        .ticks(6);

      const tree = d3.cluster()
        .size([fullHeight - 30, width - 660])
        .separation((a, b) => (a.parent === b.parent || a.parent.parent === b.parent || a.parent === b.parent.parent) ? 0.4 : 0.8);

      const stratify = d3.stratify()
        .parentId(d => d.id.substring(0, d.id.lastIndexOf(".")));

      const parseRow = d => ({
        id: d.id || 'N/A',
        median: parseFloat(d.median) || 0,
        q1: parseFloat(d.q1) || 0,
        q3: parseFloat(d.q3) || 0,
        min: parseFloat(d.min) || 0,
        max: parseFloat(d.max) || 0,
        color: d.color || '#CCCCCC'
      });

      const link = `https://maayanlab.cloud/archs4/search/loadExpressionTissue.php?search=${gene}&species=${species}&type=${type}`;

      d3.csv(link, parseRow)
        .then(data => {
          if (!data || data.length === 0 || (data.length === 1 && data[0].id === "System") ||
              (data.length === 1 && 
               data[0].median === 0 && 
               data[0].q1 === 0 && 
               data[0].q3 === 0 && 
               data[0].min === 0 && 
               data[0].max === 0)) {
            svg.selectAll("*").remove();
            svg.attr("height", compactHeight);
            svg.append("text")
              .attr("x", width / 2)
              .attr("y", compactHeight / 2)
              .attr("text-anchor", "middle")
              .attr("fill", "black")
              .text("Coming soon!");
            setLoading(false);
            return;
          }

          svg.selectAll("text").remove();

          const root = stratify(data);
          tree(root);

          g.selectAll(".link")
            .data(root.descendants().slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr("d", d => {
              return `M${d.y},${d.x}C${d.parent.y + 100},${d.x} ${d.parent.y + 100},${d.parent.x} ${d.parent.y},${d.parent.x}`;
            });

          const node = g.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
            .attr("class", d => `node${d.children ? " node--internal" : " node--leaf"}`)
            .attr("transform", d => `translate(${d.y},${d.x})`);

          node.append("circle").attr("r", 4);

          const leafNodeG = g.selectAll(".node--leaf")
            .append("g")
            .attr("class", "node--leaf-g")
            .attr("transform", "translate(8,-7)")
            .attr("ry", 6);

          leafNodeG.append("rect")
            .attr("class", "shadow")
            .style("fill", d => d.data.color)
            .attr("width", 2)
            .attr("height", 8)
            .attr("rx", 2)
            .attr("ry", 12)
            .attr("y", 3)
            .transition()
            .duration(800)
            .attr("x", d => xScale(d.data.q1) + 120)
            .attr("width", d => xScale(d.data.q3) - xScale(d.data.q1));

          leafNodeG.append("line")
            .attr("class", "line")
            .attr("x1", 1)
            .attr("y1", 7)
            .attr("x2", 1)
            .attr("y2", 7)
            .style("opacity", 1)
            .transition()
            .duration(800)
            .attr("x1", d => xScale(d.data.q3) + 120)
            .attr("x2", d => xScale(d.data.max) + 120);

          leafNodeG.append("line")
            .attr("class", "line")
            .attr("x1", 1)
            .attr("y1", 7)
            .attr("x2", 1)
            .attr("y2", 7)
            .style("opacity", 1)
            .transition()
            .duration(800)
            .attr("x1", d => xScale(d.data.min) + 120)
            .attr("x2", d => xScale(d.data.q1) + 120);

          leafNodeG.append("line")
            .attr("class", "line")
            .attr("x1", 2)
            .attr("y1", 3)
            .attr("x2", 2)
            .attr("y2", 10)
            .style("opacity", 1)
            .transition()
            .duration(800)
            .attr("x1", d => xScale(d.data.min) + 120)
            .attr("x2", d => xScale(d.data.min) + 120);

          leafNodeG.append("line")
            .attr("class", "line")
            .attr("x1", 2)
            .attr("y1", 3)
            .attr("x2", 2)
            .attr("y2", 10)
            .style("opacity", 1)
            .transition()
            .duration(800)
            .attr("x1", d => xScale(d.data.max) + 120)
            .attr("x2", d => xScale(d.data.max) + 120);

          leafNodeG.append("line")
            .attr("class", "line")
            .attr("x1", 2)
            .attr("y1", 3)
            .attr("x2", 2)
            .attr("y2", 10)
            .style("opacity", 1)
            .transition()
            .duration(800)
            .attr("x1", d => xScale(d.data.median) + 120)
            .attr("x2", d => xScale(d.data.median) + 120);

          leafNodeG.append("text")
            .attr("dy", 11)
            .attr("x", 1)
            .style("text-anchor", "right")
            .text(d => d.data.id.substring(d.data.id.lastIndexOf(".") + 1));

          const internalNode = g.selectAll(".node--internal");
          internalNode.append("text")
            .attr("y", -6)
            .style("text-anchor", "middle")
            .text(d => d.data.id.substring(d.data.id.lastIndexOf(".") + 1));

          const firstEndNode = g.select(".node--leaf");
          firstEndNode.insert("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(127,-10)")
            .call(xAxis);

          firstEndNode.insert("g")
            .attr("class", "grid")
            .attr("transform", `translate(127,${fullHeight - 15})`)
            .call(d3.axisBottom()
              .scale(xScale)
              .ticks(8)
              .tickSize(-fullHeight, 0, 0)
              .tickFormat("")
            );

          firstEndNode.insert("text")
            .style("text-anchor", "middle")
            .attr("x", 285)
            .attr("y", -30)
            .text("log expression");

          svg.selectAll(".grid").select("line")
            .style("stroke-dasharray", "0,1")
            .attr("transform", `translate(127,${fullHeight - 15})`)
            .style("stroke", "green");

          const ballG = svg.append("g")
            .attr("class", `ballG-${svgId}`)
            .style("opacity", 0);

          ballG.append("circle")
            .attr("class", "shadow")
            .style("fill", "steelblue")
            .attr("r", 2);

          ballG.append("text")
            .style("text-anchor", "middle")
            .attr("dy", 4)
            .text("0.0");

          svg.selectAll(".node--leaf-g")
            .on("mouseover", function(event, d) {
              const leafG = d3.select(this);

              leafG.select("rect")
                .attr("stroke", "#4D4D4D")
                .attr("stroke-width", "2");

              const ballGMovement = ballG.transition()
                .duration(1)
                .style("opacity", 1)
                .attr("transform", `translate(780,${d.x+28})`);

              ballGMovement.select("circle")
                .style("fill", d.data.color)
                .attr("r", 18);

              ballGMovement.select("text")
                .delay(300)
                .text(Number(d.data.median).toFixed(1));
            })
            .on("mouseout", function() {
              const leafG = d3.select(this);
              leafG.select("rect")
                .attr("stroke-width", "0");

              ballG.transition()
                .duration(200)
                .style("opacity", 0);
            });

          if (window.location.hash.length > 2) {
            const elementId = window.location.hash.slice(1);
            const element = document.getElementById(elementId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }

          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load dendrogram data:", err);
          svg.selectAll("*").remove();
          svg.attr("height", compactHeight);
          svg.append("text")
            .attr("x", width / 2)
            .attr("y", compactHeight / 2)
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .text("Failed to load data");
          setLoading(false);
        });
    };

    drawDendrogram();
  }, [species, gene, type]);

  return (
    <div>
      <div ref={svgRef} />
      {!loading && (
        <div>
          <Button
            variant="outlined"
            size="small"
            onClick={handleClick}
            sx={{ 
              textTransform: 'none',
              fontSize: '0.8rem',
              mt: 1
            }}
            endIcon={<ArrowDropDownIcon />}
          >
            Save as {selectedFormat.toUpperCase()}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleFormatSelect('svg')}>SVG</MenuItem>
            <MenuItem onClick={() => handleFormatSelect('png')}>PNG</MenuItem>
          </Menu>
        </div>
      )}
    </div>
  );
};