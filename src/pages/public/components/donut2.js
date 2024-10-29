import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { arc, pie as d3Pie } from 'd3-shape';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { Grid, Box, Typography } from "@mui/material";

export const DonutCharts = () => {
  useEffect(() => {
    const fetchDataAndDrawCharts = async () => {
      try {
        const platformData = await fetchData('https://maayanlab.cloud/archs4/search/dataStats.php?search=platform');
        const humanData = await fetchData('https://maayanlab.cloud/archs4/search/dataStats.php?search=humansamples');
        const mouseData = await fetchData('https://maayanlab.cloud/archs4/search/dataStats.php?search=mousesamples');
        drawDonutChart(platformData, '#donut-charts-a', 'platform');
        drawDonutChart(humanData, '#donut-charts-b', 'human');
        drawDonutChart(mouseData, '#donut-charts-c', 'mouse');
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
          species: type === 'platform' ? 'platform' : dataJ[3][i],
        });
        fdata.push({
          cat: dataJ[1][i],
          val: dataJ[2][i],
          species: type === 'platform' ? 'platform' : dataJ[3][i],
        });
      }

      dataset.push({ type, data, total, speciestotal });
      fdataset.push({ type, data: fdata, total, speciestotal });
      const donuts = new DonutChart(container);
      donuts.create(fdataset);
    };

    fetchDataAndDrawCharts();
  }, []);

  return (
    <>
        <Grid container sx={{textAlign: "center"}}>
            <Grid item xs={12} md={4} sx={{textAlign: "center"}}>
                <div id="donut-charts-a" className="donut-chart">
                    <h3>Platform</h3>
                </div>
            </Grid>
            <Grid item xs={12} md={4} sx={{textAlign: "center"}}>
                <div id="donut-charts-b" className="donut-chart">
                    <h3>Human <img src="/human_foot_small.png" width="22"  style={{ verticalAlign: 'middle'}} /></h3>
                </div>
            </Grid>
            <Grid item xs={12} md={4} sx={{textAlign: "center"}}>
                <div id="donut-charts-c" className="donut-chart" sx={{backgroundColor: "green"}}>
                    <h3>Mouse <img src="/mouse_foot_small.png" width="30" style={{ verticalAlign: 'middle'}} /></h3>
                </div>
            </Grid>
      </Grid>
    </>
  );
};

class DonutChart {
  constructor(container) {
    this.container = d3.select(container);
    this.transform = 300;
    this.chart_m = 200; // Margin
    this.chart_r = 130; // Radius
    this.color = d3.scaleOrdinal(schemeCategory10);
    this.arcGenerator = arc()
      .innerRadius(this.chart_r * 0.6)
      .outerRadius(this.chart_r);
  }

  create(dataset) {
    const donut = this.container
      .selectAll('.donut')
      .data(dataset)
      .enter()
      .append('svg')
      .attr('class', 'donut')
      .attr('width', 295)
      .attr('height', 295)
      .append('g')
      .attr('class', (_, i) => `donut type${i}`);

    this.createCenter();
    this.updateDonut(dataset);
  }

  createCenter() {
    const donuts = d3.selectAll('.donut');

    donuts.append('text')
      .attr('class', 'center-txt type')
      .attr('y', this.chart_r * -0.16)
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${this.transform/2}, ${this.transform/2})`)
      .style('font', '15px arial')
      .style('font-weight', 'bold');

    donuts.append('text')
      .attr('class', 'center-txt value')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${this.transform/2}, ${this.transform/2})`)
      .style('font', '16px arial');

    donuts.append('text')
      .attr('class', 'center-txt samplefield')
      .attr('text-anchor', 'middle')
      .attr('y', this.chart_r * 0.16)
      .attr('transform', `translate(${this.transform/2}, ${this.transform/2})`)
      .style('font', '16px arial');

    this.resetAllCenterText();
  }

  setCenterText(thisDonut, cate, valu) {
    thisDonut.select('.value').text(valu);
    thisDonut.select('.type').text(cate);
    thisDonut.select('.samplefield').text('samples');
  }

  resetAllCenterText() {
    const context = this;
    this.container.selectAll('.donut').each(function (d) {
      const elem = d3.select(this);
      elem.select('.value').text((d) => `${d.total} of ${d.speciestotal}`);
      elem.select('.type').text('Total');
    });
  }

  pathAnim(path, dir) {
    if (!path.node()) return;
    path.transition()
      .duration(500)
      .ease(d3.easeBounce)
      .attr('d', () => {
        const targetArc = arc()
          .innerRadius(this.chart_r * 0.6)
          .outerRadius(dir === 1 ? this.chart_r * 1.08 : this.chart_r);
        return targetArc(path.datum());
      });
  }

  updateDonut(dataset) {
    const pieLayout = d3Pie()
      .sort(null)
      .value((d) => d.val);

    const paths = this.container
      .selectAll('.donut')
      .data(dataset)
      .selectAll('path')
      .data((d) => pieLayout(d.data));

    paths
      .enter()
      .append('path')
      .attr('d', this.arcGenerator)
      .attr('transform', `translate(${this.transform/2}, ${this.transform/2})`)
      .style('fill', (d, i) => this.color(i))
      .style('stroke', '#ffffff')
      .style('stroke-width', '3px')
      .on('mouseover', (event, d) => {
        const path = d3.select(event.currentTarget);
        this.pathAnim(path, 1);
        const thisDonut = this.container.select(`.type0`);
        this.setCenterText(thisDonut, d.data.cat, d.data.val);
      })
      .on('mouseout', (event, d) => {
        const path = d3.select(event.currentTarget);
        if (!path.classed('clicked')) {
          this.pathAnim(path, 0);
        }
        const thisDonut = this.container.select(`.type0`);
        this.resetAllCenterText();
      });
  }
}