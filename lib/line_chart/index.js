import * as d3 from 'd3';
import 'd3-transition';
import legend from 'd3-svg-legend';
import { chartFactory } from '../common/index';
import { button_helper } from '../common/index';
import { save_handler } from '../common/index';

//const FileSaver = require('/scratch0/NOT_BACKED_UP/dbuchan/Code/biod3/node_modules/file-saver');
const FileSaver = require('/Users/dbuchan/Code/biod3/node_modules/file-saver');

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
  biod3_genericxyLineChart(data, 'pos', ['coil','helix', 'strand'],
                           ['DimGrey', 'HotPink', 'Gold'], 'psipred_nn_chart', {
                           assignment_ribbon: true,
                           download_buttons: true, x_cutoff: 30, });
}

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
export function biod3_genericxyLineChart(data, xseries, yseries, lineColours, label='xyLineChart', opts={})
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
  drawxyChart(chart, data, xFunc, yFuncs);
  if(chart.key_panel)
  {
    drawLegend(chart, yseries, lineColours);
  }
  if(chart.download_buttons)
  {
    button_helper(chart, "png", 0);
    button_helper(chart, "svg", 90);
    save_handler(chart, label);
  }
  if(chart.assignment_ribbon)
  {
    draw_assignment_ribbon(chart);
  }
  if(chart.x_cutoff)
  {
    add_cutoff_line(chart, scales, chart.x_cutoff, "x");
  }
  if(chart.y_cutoff)
  {
    add_cutoff_line(chart, scales, chart.y_cutoff, "y");
  }
}

function draw_assignment_ribbon(chart)
{
  console.log("Drawing ASSIGNMENT RIBBON");
}

function add_cutoff_line(chart, scales, value, axis)
{
  let alt_axis = "x";
  let idx = 1;
  let label = chart.y_cutoff_text;
  let x_adjust = 5;
  if(axis === "x")
  {
    alt_axis = "y";
    idx = 0;
    label = chart.x_cutoff_text;
    x_adjust = -3;
  }
  console.log(axis);
  console.log(alt_axis);
  const cutoff = chart.container.append("line")
                      .classed("cutoff_line", true)
                      .attr(alt_axis+"1", 0)
                      .attr(axis+"1", scales[axis](value))
                      .attr(alt_axis+"2", scales[alt_axis].range()[idx])
                      .attr(axis+"2", scales[axis](value));
  const cutoff_label = chart.container.append("text")
                            .attr('class', 'cutoffText')
                            .attr(alt_axis, 5)
                            .attr(axis, (scales[axis](value) - x_adjust))
                            .attr("dy", ".1em")
                            .text(label+": "+value.toString());
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

function drawxyChart(chart, data, xFunc, yFuncs)
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
