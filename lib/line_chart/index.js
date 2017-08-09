import * as d3 from 'd3';
import 'd3-transition';
import legend from 'd3-svg-legend';
import { chartFactory } from '../common/index';

// data is a csv parsed in to an array such that each entry is an object with
// the fields such as:
// [
//  {pos: 1, res: 'P', ss: 'E', coil: 0.997, helix: 0.000, strand: 0.002},
//  {pos: 2, res: 'K', ss: 'E', coil: 0.887, helix: 0.005, strand: 0.003},
//  ...
// ]
// xseries is a string which names an entry in the data that will be used as
// the x values (i.e. 'pos'), and must be numeric data
// yseries is an array containing the names of the columns with y values to
// be plotted (i.e. ['coil, 'helix', 'strand'])
// lineColours : an array of valid css colours  ['DimGrey', 'HotPink', 'Gold']
// opts: an object to override the chartFactory defaults
export function biod3_genericxyLineChart(data, xseries, yseries, lineColours, opts={})
{
  opts = Object.assign(opts, {margin: {top: 80, bottom: 80, right: 80, left: 80}});
  const chart = chartFactory(opts);
  //set up X scale and values
  const xVals = data.reduce(function (arr, val) { return arr.concat(Number(val[xseries])); }, []);
  const xFunc = function (d) {return scales.x(d[xseries]);};
  //build array of all possible y values
  let yVals = [];
  yseries.forEach( function (value) {
    yVals = yVals.concat(data.reduce(function (arr, val) { return arr.concat(Number(val[value])); }, []));
  });

  // build the scales and axis
  const scales = setScale(chart, xVals, yVals);
  drawAxis(chart, scales.x, scales.y);

  const yFuncs = {};
  yseries.forEach (function (value) {
    yFuncs[value] = function (d) {return scales.y(d[value]);};
  });
  drawxyChart(chart, data, scales, xFunc, yFuncs);
  if(chart.key_panel)
  {
    drawLegend(chart, yseries, lineColours);
  }
}

//takes the contents of an ss or ss2 file formatted as
//convenience function that expects an SS files data and calls genericxyLineChart
//with the relevant args pre-configured.
// [
//  {pos: 1, res: 'P', ss: 'E', coil: 0.997, helix: 0.000, strand: 0.002},
//  {pos: 2, res: 'K', ss: 'E', coil: 0.887, helix: 0.005, strand: 0.003},
//  ...
// ]
export function biod3_psipredxyLineChart(data)
{
  biod3_genericxyLineChart(data, 'pos', ['coil','helix', 'strand'], ['DimGrey', 'HotPink', 'Gold']);
}

function drawLegend(chart, yseries, lineColours)
{
  //build scale
  var ordinal = d3.scaleOrdinal()
    .domain(yseries)
    .range(lineColours);

  var legendOrdinal = legend.legendColor()
     .shape("path", d3.symbol().type(d3.symbolSquare).size(150)())
     .shapePadding(10)
     //.cellFilter(function(d){ return d.label !== "e" })
    .scale(ordinal);

  chart.key.append("g")
   .attr('class', 'legendOrdinal')
   .call(legendOrdinal);

}

function drawxyChart(chart, data, scales, xFunc, yFuncs)
{
  Object.keys(yFuncs).forEach(function (key) {
    let obj = yFuncs[key];
    let Gen = d3.line()
      .x(xFunc)
      .y(obj)
      .curve(d3.curveBasis);
    let Line = chart.container.selectAll("."+key+"line")
      .data([data]);
    Line.enter().append("path").classed(key, true)
      .merge(Line)
      .attr("d", Gen)
      .attr("fill", "none");
  });
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
