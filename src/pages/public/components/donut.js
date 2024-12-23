import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { pie as d3Pie, arc } from 'd3-shape'; 
import { schemeCategory10 } from 'd3-scale-chromatic'; 

export const DonutCharts = () => {
  useEffect(() => {
    const fetchDataAndDrawCharts = async () => {
      try {
        const platformData = await fetchData('https://maayanlab.cloud/archs4/search/dataStats.php?search=platform');
        //const humanData = await fetchData('https://maayanlab.cloud/archs4/search/dataStats.php?search=humansamples');
        //const mouseData = await fetchData('https://maayanlab.cloud/archs4/search/dataStats.php?search=mousesamples');
        drawDonutChart(platformData, '#donut-charts-a', 'platform');
        //drawDonutChart(humanData, '#donut-charts-b', 'human');
        //drawDonutChart(mouseData, '#donut-charts-c', 'mouse');
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    const fetchData = async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    };

    const drawDonutChart = (dataJ, container, type) => {
      const dataset = [];
      const fdataset = [];
      const data = [];
      const fdata = [];
      const total = dataJ[0];
      const speciestotal = type === 'platform' ? dataJ[5] : dataJ[4];

      for (let i = 0; i < dataJ[1].length; i++) {
        data.push({
          cat: dataJ[1][i],
          val: dataJ[2][i],
          species: type === 'platform' ? 'platform' : dataJ[3][i]
        });
        fdata.push({
          cat: dataJ[1][i],
          val: dataJ[2][i],
          species: type === 'platform' ? 'platform' : dataJ[3][i]
        });
      }

      dataset.push({ type, data, total, speciestotal });
      fdataset.push({ type, data: fdata, total, speciestotal });
      console.log(fdataset);
      const donuts = new DonutChart(container);
      donuts.create(fdataset);
      //donuts.update(dataset);
    };

    fetchDataAndDrawCharts();
  }, []);

  return (
    <>
      <div id="donut-charts-a" className="donut-chart" sx={{
        width: "200px",
        height: "200px"
      }}><h3>Platform</h3></div>
      {/*<div id="donut-charts-b" className="donut-chart"><h3>Human Samples</h3></div>
      <div id="donut-charts-c" className="donut-chart"><h3>Mouse Samples</h3></div> */}
    </>
  );
};

class DonutChart {
  constructor(container) {
    this.container = d3.select(container);
    this.chart_m = 200; // Margin
    this.chart_r = 90; // Radius
    this.color = d3.scaleOrdinal(schemeCategory10);
    this.or = 150
    this.pieLayout = d3Pie()
        .sort(null)
        .value((d) => d.val);
  
    // Arc generator with corrected access to 'this'
    this.arcGenerator = arc()
        .innerRadius(this.chart_r * 0.6)
        .outerRadius((d, i, nodes) => {
            const pathElement = d3.select(nodes[i]);
            return pathElement.classed('clicked') ? this.chart_r * 1.08 : this.chart_r;
        });

    this.arcGenerator = arc()
        .innerRadius(this.chart_r)
        .outerRadius(this.or);
  }

  getCatNames(dataset) {
    return dataset[0].data.map((entry) => entry.cat);
  }

  create(dataset) {
    this.chart_m = this.container.node().getBoundingClientRect().width / dataset.length / 2 * 0.14;
    this.chart_r = this.container.node().getBoundingClientRect().width / dataset.length / 2 * 0.85;

    const donut = this.container.selectAll('.donut')
      .data(dataset)
      .enter().append('svg')
        .attr('class', 'donut')
        .attr('width', (this.chart_r + this.chart_m) * 2)
        .attr('height', (this.chart_r + this.chart_m) * 2)
      .append('g')
        .attr('class', (_, i) => `donut type${i}`)
        .attr('transform', `translate(${this.chart_r + this.chart_m}, ${this.chart_r + this.chart_m})`);

    this.createCenter();
    this.updateDonut();
  }

  update(dataset) {
    const donut = this.container.selectAll(".donut").data(dataset);
    this.updateDonut();
  }

  createCenter() {
    const donuts = d3.selectAll('.donut');

    donuts.append('text')
      .attr('class', 'center-txt type')
      .attr('y', this.chart_r * -0.16)
      .attr('text-anchor', 'middle')
      .style("font", "15px arial")
      .style('font-weight', 'bold');

    donuts.append('text')
      .attr('class', 'center-txt value')
      .attr('text-anchor', 'middle')
      .style("font", "16px arial");

    donuts.append('text')
      .attr('class', 'center-txt samplefield')
      .attr('text-anchor', 'middle')
      .attr('y', this.chart_r * 0.16)
      .style("font", "16px arial");

    this.resetAllCenterText();
  }

  setCenterText(thisDonut, cate, valu) {
    this.container.selectAll('.value').text('');
    this.container.selectAll('.type').text('');
    this.container.selectAll('.samplefield').text('');
    
    thisDonut.select('.value').text(valu);
    thisDonut.select('.type').text(cate);
    thisDonut.select('.samplefield').text('samples');
  }

  resetAllCenterText() {
    this.container.select('.value')
      .text((d) => `${d.total} of ${d.speciestotal}`);

    this.container.selectAll('.type').text('Total');
  }


pathAnim(path, dir) {
    console.log(path, dir)
    switch(dir) {
        case 0:
        path.transition()
            .duration(500)
            .ease(d3.easeBounce)
            .attr('d', arc()
            .innerRadius(this.chart_r)
            .outerRadius(this.or));
        break;

        case 1:
        path.transition()
            .attr('d', arc()
            .innerRadius(this.chart_r)
            .outerRadius(this.or * 1.08));
        break;
    }
}


pathAnim(pathElement, dir) {
    console.log(pathElement["_groups"][0][0], dir);
    const arcGenerator = d3.arc()
      .innerRadius(this.chart_r)
      .outerRadius((dir === 1) ? this.or * 1.08 : this.or);
    
    
    pathElement.transition()
      .duration(500)
      .ease(d3.easeBounce)
      .attr('d', arc()
        .innerRadius(this.chart_r * 0.6)
        .outerRadius(this.chart_r * 1.08));
  }

  updateDonut() {
    const eventObj = {
      'mouseover': (d, i, j) => {
        this.pathAnim(d3.select(d), 1);
        const thisDonut = this.container.select(`.type0`);
        this.setCenterText(thisDonut, d.data.cat, d.data.val);
      },
      'mouseout': (d, i, j) => {
        const thisPath = d3.select(this);
        if (!thisPath.classed('clicked')) {
          this.pathAnim(thisPath, 0);
        }
        const thisDonut = this.container.select(`.type${j}`);
        this.resetAllCenterText();
      },
      'click': (d, i, j) => {
        if (d.data.species !== "platform") {
          sessionStorage.setItem("sent", d.data.cat);
          sessionStorage.setItem("species", d.data.species);
          window.open("data", "_self");
        }
      }
    };

    const paths = this.container.selectAll('.donut')
      .selectAll('path')
      .data((d, i) => this.pieLayout(d.data));

    paths.transition()
      .duration(1000)
      .attr('d', arc()
      .innerRadius(this.chart_r*0.4)
      .outerRadius(this.or*0.6));

    paths.enter()
      .append('svg:path')
      .attr('d', arc()
            .innerRadius(this.chart_r*0.5)
            .outerRadius(this.or*0.7))
      .style('fill', (d, i) => this.color(i))
      .style('stroke', '#ffffff')
      .style('stroke-width', '3px')
      .on('mouseover', function(event, d) {
        eventObj.mouseover.call(this, d, d3.select(this.parentNode).datum(), d3.select(this).datum());
      });
      //.on(eventObj);

    paths.exit().remove();
  }
}
