import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Canvg } from 'canvg';
import { saveAs } from 'file-saver';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import "./dendrogram.css";

export const DendrogramAtlas = ({ species, gene, type }) => {
  const svgRef = useRef();
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('svg');
  let currentBoxWidth = 0; // Track the current width of the info box

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleFormatSelect = (format) => {
    setSelectedFormat(format);
    saveAsImage(format);
    handleClose();
  };

  const saveAsImage = (format) => {
    const svgElement = svgRef.current.querySelector('svg');
    if (!svgElement) return;

    // Clone the SVG to modify it
    const svgClone = svgElement.cloneNode(true);

    // Embed local CSS rules
    const styleSheets = Array.from(document.styleSheets)
      .filter(sheet => sheet.href && sheet.href.includes('dendrogram.css') || !sheet.href); // Local styles only
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

    if (format === 'svg') {
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svgClone);
      svgString = '<?xml version="1.0" standalone="no"?>\n' +
                  '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
                  svgString;
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      saveAs(svgBlob, `dendrogram_${gene}_${species}_${type}.svg`);
    } else if (format === 'png') {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgClone);
      const canvas = document.createElement('canvas');
      canvas.width = parseInt(svgElement.getAttribute('width'));
      canvas.height = parseInt(svgElement.getAttribute('height'));
      const ctx = canvas.getContext('2d');
      Canvg.from(ctx, svgString).then(v => {
        v.render().then(() => {
          canvas.toBlob(blob => {
            saveAs(blob, `dendrogram_${gene}_${species}_${type}.png`);
          }, 'image/png', 1.0);
        });
      }).catch(err => console.error('Error rendering SVG to canvas:', err));
    }
  };

  useEffect(() => {
    const drawDendrogram = async () => {
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
        .style("z-index", 1000);

      svg.append("text")
        .attr("x", width / 2)
        .attr("y", fullHeight / 2)
        .attr("text-anchor", "middle")
        .text("Loading dendrogram...");

      const g = svg.append("g").attr("transform", "translate(50,30)");
      const xScale = d3.scaleLinear().domain([0, 16]).range([60, 260]);
      const xAxis = d3.axisTop().scale(xScale).ticks(6);
      const tree = d3.cluster()
        .size([fullHeight - 30, width - 660])
        .separation((a, b) => (a.parent === b.parent || a.parent.parent === b.parent || a.parent === b.parent.parent) ? 0.4 : 0.8);
      const stratify = d3.stratify().parentId(d => d.id.substring(0, d.id.lastIndexOf(".")));

      const transformData = (data) => {
        const result = [{ id: "System", min: 0, q1: 0, median: 0, q3: 0, max: 0, color: "#CCCCCC" }];
        const seenIds = new Set(["System"]);
      
        const addEntry = (path, stats = null) => {
          const id = "System." + path.join('.');
          if (!seenIds.has(id)) {
            seenIds.add(id);
            result.push({
              id,
              name: path[path.length - 1],
              min: stats?.min ?? 0,
              q1: stats?.q1 ?? 0,
              median: stats?.median ?? 0,
              q3: stats?.q3 ?? 0,
              max: stats?.max ?? 0,
              color: stats?.color ?? '#CCCCCC',
              sample_count: stats?.sample_count ?? 0,
              series_count: stats?.series_count ?? 0,
              std: stats?.std ?? 0
            });
          }
        };
      
        const traverse = (obj, currentPath = []) => {
          if (!obj.statistics) {
            addEntry(currentPath);
          }
          Object.entries(obj).forEach(([key, value]) => {
            const newPath = [...currentPath, key];
            if (value.statistics) {
              value.statistics.color = value.color;
              value.statistics.sample_count = value.sample_count;
              value.statistics.series_count = value.series_count;
              addEntry(newPath, value.statistics);
            } else {
              traverse(value, newPath);
            }
          });
        };
      
        traverse(data);
        return result;
      };

      const pruneTree = (node) => {
        if (!node.children) {
          if (node.data.sample_count === 0) {
            return null;
          }
          return node;
        }
        node.children = node.children.map(pruneTree).filter(child => child !== null);
        if (node.children.length === 0) {
          return null;
        }
        return node;
      };

      const getLuminance = (color) => {
        const rgb = d3.rgb(color);
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;
        const lum = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        return 0.2126 * lum(r) + 0.7152 * lum(g) + 0.0722 * lum(b);
      };

      try {
        const response = await fetch(`https://maayanlab.cloud/sigpy/atlas?gene=${gene}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const jsonData = await response.json();
        console.log("Raw API Response:", jsonData);

        const data = transformData(jsonData.data || jsonData);
        console.log("Transformed Data:", data);

        if (!data || data.length <= 1) {
          svg.selectAll("*").remove();
          svg.attr("height", compactHeight);
          svg.append("text")
            .attr("x", width / 2)
            .attr("y", compactHeight / 2)
            .attr("text-anchor", "middle")
            .text("No data available");
          setLoading(false);
          return;
        }

        svg.selectAll("text").remove();
        let root = stratify(data);
        console.log("Stratified Root Before Pruning:", root);

        root = pruneTree(root);
        if (root === null) {
          svg.selectAll("*").remove();
          svg.attr("height", compactHeight);
          svg.append("text")
            .attr("x", width / 2)
            .attr("y", compactHeight / 2)
            .attr("text-anchor", "middle")
            .text("No data available");
          setLoading(false);
          return;
        }
        console.log("Stratified Root After Pruning:", root);

        tree(root);

        g.selectAll(".link")
          .data(root.descendants().slice(1))
          .enter().append("path")
          .attr("class", "link")
          .attr("d", d => `M${d.y},${d.x}C${d.parent.y + 100},${d.x} ${d.parent.y + 100},${d.parent.x} ${d.parent.y},${d.parent.x}`);

        const node = g.selectAll(".node")
          .data(root.descendants())
          .enter().append("g")
          .attr("class", d => `node${d.children ? " node--internal" : " node--leaf"}`)
          .attr("transform", d => `translate(${d.y},${d.x})`);

        node.append("circle").attr("r", 4);

        const leafNodeG = g.selectAll(".node--leaf")
          .append("g")
          .attr("class", "node--leaf-g")
          .attr("transform", "translate(8,-7)");

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

        const iqr = (d) => d.data.q3 - d.data.q1;
        const cappedMin = (d) => Math.max(d.data.min, d.data.q1 - 0.5 * iqr(d));
        const cappedMax = (d) => Math.min(d.data.max, d.data.q3 + 0.5 * iqr(d));

        leafNodeG.append("line")
          .attr("class", "line")
          .attr("x1", 1)
          .attr("y1", 7)
          .attr("x2", 1)
          .attr("y2", 7)
          .style("opacity", 1)
          .transition()
          .duration(800)
          .attr("x1", d => xScale(cappedMin(d)) + 120)
          .attr("x2", d => xScale(d.data.q1) + 120);

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
          .attr("x2", d => xScale(cappedMax(d)) + 120);

        leafNodeG.append("line")
          .attr("class", "line")
          .attr("x1", 2)
          .attr("y1", 3)
          .attr("x2", 2)
          .attr("y2", 10)
          .style("opacity", 1)
          .transition()
          .duration(800)
          .attr("x1", d => xScale(cappedMin(d)) + 120)
          .attr("x2", d => xScale(cappedMin(d)) + 120);

        leafNodeG.append("line")
          .attr("class", "line")
          .attr("x1", 2)
          .attr("y1", 3)
          .attr("x2", 2)
          .attr("y2", 10)
          .style("opacity", 1)
          .transition()
          .duration(800)
          .attr("x1", d => xScale(cappedMax(d)) + 120)
          .attr("x2", d => xScale(cappedMax(d)) + 120);

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
          .style("fill", "#000000")
          .text(d => d.data.id.substring(d.data.id.lastIndexOf(".") + 1));

        const internalNode = g.selectAll(".node--internal");
        internalNode.append("text")
          .attr("y", -6)
          .style("text-anchor", "middle")
          .style("fill", "#000000")
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
          .style("stroke", "green");

        const infoBoxG = svg.append("g")
          .attr("class", `infoBoxG-${svgId}`)
          .style("opacity", 0);

        infoBoxG.append("rect")
          .attr("class", "info-bg")
          .attr("height", 120)
          .attr("rx", 12)
          .attr("ry", 12)
          .style("fill", "#fff")
          .style("stroke", "#ccc")
          .style("stroke-width", 1)
          .attr("width", currentBoxWidth);

        infoBoxG.append("rect")
          .attr("class", "info-header")
          .attr("height", 24)
          .style("fill", "#ccc")
          .attr("width", currentBoxWidth);

        infoBoxG.append("text")
          .attr("class", "info-title")
          .attr("x", 15)
          .attr("y", 16)
          .style("font-weight", "bold")
          .style("font-size", "12px")
          .style("fill", "#000");

        infoBoxG.append("text")
          .attr("class", "info-samples-label")
          .attr("x", 15)
          .attr("y", 46)
          .style("font-weight", "bold")
          .style("font-size", "12px")
          .style("fill", "#000")
          .text("Samples");

        infoBoxG.append("text")
          .attr("class", "info-samples-value")
          .attr("x", 140)
          .attr("y", 46)
          .style("font-size", "12px")
          .style("fill", "#000");

        infoBoxG.append("text")
          .attr("class", "info-series-label")
          .attr("x", 15)
          .attr("y", 64)
          .style("font-weight", "bold")
          .style("font-size", "12px")
          .style("fill", "#000")
          .text("Unique Series");

        infoBoxG.append("text")
          .attr("class", "info-series-value")
          .attr("x", 140)
          .attr("y", 64)
          .style("font-size", "12px")
          .style("fill", "#000");

        infoBoxG.append("text")
          .attr("class", "info-mean-label")
          .attr("x", 15)
          .attr("y", 82)
          .style("font-weight", "bold")
          .style("font-size", "12px")
          .style("fill", "#000")
          .text("Median Expression");

        infoBoxG.append("text")
          .attr("class", "info-mean-value")
          .attr("x", 140)
          .attr("y", 82)
          .style("font-size", "12px")
          .style("fill", "#000");

        infoBoxG.append("text")
          .attr("class", "info-std-label")
          .attr("x", 15)
          .attr("y", 100)
          .style("font-weight", "bold")
          .style("font-size", "12px")
          .style("fill", "#000")
          .text("Standard Deviation");

        infoBoxG.append("text")
          .attr("class", "info-std-value")
          .attr("x", 140)
          .attr("y", 100)
          .style("font-size", "12px")
          .style("fill", "#000");

        svg.selectAll(".node--leaf-g")
          .on("mouseover", function(event, d) {
            const leafG = d3.select(this);
            leafG.select("rect")
              .attr("stroke", "#4D4D4D")
              .attr("stroke-width", "2");

            infoBoxG.attr("transform", `translate(770,${d.x - 30})`);
            infoBoxG.select(".info-bg").attr("width", currentBoxWidth);
            infoBoxG.select(".info-header")
              .attr("width", currentBoxWidth)
              .style("fill", d.data.color);

            const bgLuminance = getLuminance(d.data.color);
            const blackLuminance = getLuminance("#000000");
            const whiteLuminance = getLuminance("#ffffff");
            const contrastWithBlack = (Math.max(bgLuminance, blackLuminance) + 0.05) / 
                                     (Math.min(bgLuminance, blackLuminance) + 0.05);
            const contrastWithWhite = (Math.max(bgLuminance, whiteLuminance) + 0.05) / 
                                     (Math.min(bgLuminance, whiteLuminance) + 0.05);
            const textColor = contrastWithBlack > 2*contrastWithWhite ? "#000000" : "#ffffff";
            infoBoxG.select(".info-title").style("fill", textColor);

            infoBoxG.select(".info-title").text(d.data.name);
            infoBoxG.select(".info-samples-value").text(`${d.data.sample_count}`);
            infoBoxG.select(".info-series-value").text(`${d.data.series_count}`);
            infoBoxG.select(".info-mean-value").text(`${Number(d.data.median).toFixed(2)}`);
            infoBoxG.select(".info-std-value").text(`${Number(d.data.std).toFixed(2)}`);

            const textWidths = infoBoxG.selectAll("text").nodes().map(node => node.getComputedTextLength());
            const maxWidth = Math.max(...textWidths);
            const boxWidth = maxWidth + 70;
            currentBoxWidth = boxWidth;

            infoBoxG.raise();
            infoBoxG.transition().duration(300).style("opacity", 1);
            infoBoxG.select(".info-bg").transition().duration(300).attr("width", boxWidth);
            infoBoxG.select(".info-header").transition().duration(300).attr("width", boxWidth);
          })
          .on("mouseout", function() {
            const leafG = d3.select(this);
            leafG.select("rect").attr("stroke-width", "0");
            infoBoxG.transition().duration(200).style("opacity", 0);
          });

        setLoading(false);
      } catch (err) {
        console.error("Failed to load dendrogram data:", err);
        svg.selectAll("*").remove();
        svg.attr("height", compactHeight);
        svg.append("text")
          .attr("x", width / 2)
          .attr("y", compactHeight / 2)
          .attr("text-anchor", "middle")
          .text("Failed to load data");
        setLoading(false);
      }
    };

    drawDendrogram();
  }, [species, gene, type]);

  return (
    <div style={{ position: 'relative', zIndex: 1000 }}>
      <div ref={svgRef} />
      {!loading && (
        <div>
          <Button
            variant="outlined"
            size="small"
            onClick={handleClick}
            sx={{ textTransform: 'none', fontSize: '0.8rem', mt: 1 }}
            endIcon={<ArrowDropDownIcon />}
          >
            Save as {selectedFormat.toUpperCase()}
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={() => handleFormatSelect('svg')}>SVG</MenuItem>
            <MenuItem onClick={() => handleFormatSelect('png')}>PNG</MenuItem>
          </Menu>
        </div>
      )}
    </div>
  );
};