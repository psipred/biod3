import * as d3 from 'd3';
import legend from 'd3-svg-legend';
import { chartFactory } from '../common/index';

// simply xy chart which takes a data structure
//
// [
//  {x: 1, y: 12},
//  {x: 5, y: 50},
//  ...
// ]

export function biod3_xyLineChart(data)
{
  const chart = chartFactory({margin: {top: 80, bottom: 80, right: 80, left: 80}});
  const xVals = data.reduce(function (arr, val) { return arr.concat(Number(val.x)); }, []);
  const yVals = data.reduce(function (arr, val) { return arr.concat(Number(val.y)); }, []);
  const scales = setScale(chart, xVals, yVals);
  drawAxis(chart, scales.x, scales.y);
  const xFunc = function (d) {return scales.x(d.x);};
  const yFunc = function (d) {return scales.y(d.y);};
  drawChart(chart, data, scales, xFunc, yFunc);
}

//takes the contents of an ss or ss2 file formatted as
//
// [
//  {pos: 1, res: 'P', ss: 'E', coil: 0.997, helix: 0.000, strand: 0.002},
//  {pos: 2, res: 'K', ss: 'E', coil: 0.887, helix: 0.005, strand: 0.003},
//  ...
// ]
export function biod3_psipredxyLineChart(data)
{
  const chart = chartFactory({margin: {top: 80, bottom: 80, right: 80, left: 80}});
  const xVals = data.reduce(function (arr, val) { return arr.concat(Number(val.pos)); }, []);
  const coilVals = data.reduce(function (arr, val) { return arr.concat(Number(val.coil)); }, []);
  const helixVals = data.reduce(function (arr, val) { return arr.concat(Number(val.helix)); }, []);
  const strandVals = data.reduce(function (arr, val) { return arr.concat(Number(val.strand)); }, []);
  const yVals = coilVals.concat(helixVals).concat(strandVals);
  const scales = setScale(chart, xVals, yVals);
  drawAxis(chart, scales.x, scales.y);
  const xFunc = function (d) {return scales.x(d.pos);};
  const coilFunc = function (d) {return scales.y(d.coil);};
  const helixFunc = function (d) {return scales.y(d.helix);};
  const strandFunc = function (d) {return scales.y(d.strand);};
  drawPsipredChart(chart, data, scales, xFunc, coilFunc, helixFunc, strandFunc);
  if(chart.key_panel)
  {
    drawLegend(chart);
  }
}

function drawLegend(chart)
{
  //build scale
  //add legend to svg element
  //call
}

function drawPsipredChart(chart, data, scales, xFunc, coilFunc, helixFunc, strandFunc)
{
  const coilGen = d3.line()
    .x(xFunc)
    .y(coilFunc)
    .curve(d3.curveBasis);

  const helixGen = d3.line()
    .x(xFunc)
    .y(helixFunc)
    .curve(d3.curveBasis);

  const strandGen = d3.line()
    .x(xFunc)
    .y(strandFunc)
    .curve(d3.curveBasis);

  const coilLine = chart.container.selectAll(".coilline")
    .data([data]);
  coilLine.enter().append("path").classed("coil", true)
    .merge(coilLine)
    .attr("d", coilGen)
    .attr("fill", "none");

  const helixLine = chart.container.selectAll(".helixline")
    .data([data]);
  helixLine.enter().append("path").classed("helix", true)
    .merge(helixLine)
    .attr("d", helixGen)
    .attr("fill", "none");

  const strandLine = chart.container.selectAll(".strandline")
    .data([data]);
  strandLine.enter().append("path").classed("strand", true)
    .merge(strandLine)
    .attr("d", strandGen)
    .attr("fill", "none");

}

function setScale(chart, xVals, yVals)
{
  const yRange = chart.height - chart.margin.bottom * 2;
//const xVals = data.reduce(function (arr, val) { return arr.concat(val.pos); }, []);

  const x = d3.scaleLinear().range([0, chart.container_width - chart.margin.left - chart.margin.right])
    .domain(d3.extent(xVals));
  const y = d3.scaleLinear().range([yRange, 0])
    .domain(d3.extent(yVals));
  return {x, y};
}

function drawAxis(chart, x, y)
{
  const xAxis = d3.axisBottom().scale(x);
  const yAxis = d3.axisLeft().scale(y);
  chart.axes.append('g')
    .attr('class', 'axis y')
    .attr('transform', 'translate('+[chart.margin.left, chart.margin.top]+')')
    .call(yAxis);

  chart.axes.append('g')
    .attr('class', 'axis x')
    .attr('transform', 'translate('+[chart.margin.left, chart.height-chart.margin.bottom]+')')
    .call(xAxis);
}

function drawChart(chart, data, scales, xFunc, yFunc)
{
    const lineGen = d3.line()
      .x(xFunc)
      .y(yFunc)
      .curve(d3.curveBasis);

  const line = chart.container.selectAll(".line")
    .data([data]);

  line.enter().append("path").classed("line", true)
    .merge(line)
    .attr("d", lineGen)
    .attr("fill", "none")

}
