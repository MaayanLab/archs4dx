import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import "./dendrogram.css"

export const Dendrogram = ({ species, gene, type }) => {
  const svgRef = useRef();

  useEffect(() => {
    const drawDendrogram = () => {
      const svgId = type === 'tissue' ? 'cellline' : 'tissue';
      
      const svgElement = d3.select(svgRef.current);
      svgElement.selectAll("*").remove();  // Clear existing content

      const width = 1000;
      const height = 1000;

      const svg = svgElement.append("svg")
        .attr("id", svgId)
        .attr("width", width)
        .attr("height", height);
    
      const g = svg.append("g")
        .attr("transform", "translate(50,30)");

      const xScale = d3.scaleLinear()
        .domain([0, 16])
        .range([60, 260]);

      const xAxis = d3.axisTop()
        .scale(xScale)
        .ticks(6);

      // Prepare the tree layout
      const tree = d3.cluster()
        .size([height - 30, width - 660])
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

      d3.csv(link, parseRow).then(data => {

        const root = stratify(data);
        tree(root);

        // Draw links
        g.selectAll(".link")
          .data(root.descendants().slice(1))
          .enter().append("path")
          .attr("class", "link")
          .attr("d", d => {
            return `M${d.y},${d.x}C${d.parent.y + 100},${d.x} ${d.parent.y + 100},${d.parent.x} ${d.parent.y},${d.parent.x}`;
          });

        // Setup nodes
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
          .attr("transform", `translate(127,${height - 15})`)
          .call(d3.axisBottom()
            .scale(xScale)
            .ticks(8)
            .tickSize(-height, 0, 0)
            .tickFormat("")
          );
        
        firstEndNode.insert("text")
          .style("text-anchor", "middle")
          .attr("x", 285)
          .attr("y", -30)
          .text("log expression");

        svg.selectAll(".grid").select("line")
          .style("stroke-dasharray", "0,1")
          .attr("transform", `translate(127,${height - 15})`)
          .style("stroke", "green");

        const ballG = svg.insert("g")
          .attr("class", "ballG")
          .attr("transform", `translate(1150,${height / 2})`);
        ballG.insert("circle")
          .attr("class", "shadow")
          .style("fill", "steelblue")
          .attr("r", 2);
        ballG.insert("text")
          .style("text-anchor", "middle")
          .attr("dy", 4)
          .text("0.0");

        d3.selectAll(".node--leaf-g")
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut);

        function handleMouseOver(d) {
          const leafG = d3.select(this);

          leafG.select("rect")
            .attr("stroke", "#4D4D4D")
            .attr("stroke-width", "2");
        
          const ballGMovement = ballG.transition()
            .duration(1)
            .attr("transform", `translate(${780},${d.target.__data__.x+19})`);

          ballGMovement.select("circle")
            .style("fill", d.target.__data__.data.color)
            .attr("r", 18);

          ballGMovement.select("text")
            .delay(300)
            .text(Number(d.target.__data__.data.median).toFixed(1));
        }

        function handleMouseOut() {
          const leafG = d3.select(this);
          leafG.select("rect")
            .attr("stroke-width", "0");
        }

        if (window.location.hash.length > 2) {
          const elementId = window.location.hash.slice(1);
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    };

    drawDendrogram();
  }, [species, gene, type]);

  return (
    <div ref={svgRef} />
  );
};
