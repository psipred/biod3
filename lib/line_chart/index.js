import * as d3 from 'd3';
import 'd3-transition';
import legend from 'd3-svg-legend';
import { chartFactory } from '../common/index';
import { getSVGString } from '../common/index';
import { svgString2Image } from '../common/index';
import { writeSVGDownloadLink } from '../common/index';
const FileSaver = require('/scratch0/NOT_BACKED_UP/dbuchan/Code/biod3/node_modules/file-saver');

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
  if(chart.download_buttons)
  {
    draw_buttons(chart, "psipred_nn_trace");
  }
  if(chart.assignment_ribbon)
  {
    draw_assignment_ribbon(chart);
  }
}

// Some parts of this function adapted from
// http://bl.ocks.org/Rokotyan/0556f8facbaf344507cdc45dc3622177
function draw_buttons(chart, label)
{

  chart.buttons.append("rect")
     .attr('id', 'pngButton')
     .attr('width', 70)
     .attr('height', 20)
     .attr('class', 'pngbutton')
     .on('mouseover', function(){
        d3.select('#pngButton')
          .attr('fill', '')
          .classed('active', true);
        d3.select('#pngText')
          .attr('fill', '')
          .classed('active', true);})
      .on('mouseout', function(){
        d3.select('#pngButton')
          .classed('active', false);
        d3.select('#pngText')
          .classed('active', false);
     });

  chart.buttons.append("text")
    .attr('id', 'pngText')
    .attr('class', 'buttonText')
    .attr("x", 10)
    .attr("y", 10)
    .attr("dy", ".35em")
    .text("Get PNG")
    .on('mouseover', function(){
        d3.select('#pngButton')
          .attr('fill', '')
          .classed('active', true);
        d3.select('#pngText')
          .attr('fill', '')
          .classed('active', true);})
    .on('mouseout', function(){
        d3.select('#pngButton')
          .classed('active', false);
        d3.select('#pngText')
          .classed('active', false);
     });

  chart.buttons.append("rect")
    .attr("x", 90)
    .attr('id', 'svgButton')
    .attr('width', 70)
    .attr('height', 20)
    .attr('class', 'svgbutton')
    .on('mouseover', function(){
        d3.select('#svgButton')
          .attr('fill', '')
          .classed('active', true);
        d3.select('#svgText')
          .attr('fill', '')
          .classed('active', true);})
      .on('mouseout', function(){
        d3.select('#svgButton')
          .classed('active', false);
        d3.select('#svgText')
          .classed('active', false);
     });
  chart.buttons.append("text")
    .attr('class', 'buttonText')
    .attr('id', 'svgText')
    .attr("x", 100)
    .attr("y", 10)
    .attr("dy", ".35em")
    .text("Get SVG")
    .on('mouseover', function(){
        d3.select('#svgButton')
          .attr('fill', '')
          .classed('active', true);
        d3.select('#svgText')
          .attr('fill', '')
          .classed('active', true);})
    .on('mouseout', function(){
        d3.select('#svgButton')
          .classed('active', false);
        d3.select('#svgText')
          .classed('active', false);
     });

  d3.select('#pngButton').on('click', function(){
    var svgString = getSVGString(chart.svg.node());
    console.log(svgString);
	  svgString2Image( svgString, 2*chart.width, 2*chart.height, 'png', save ); // passes Blob and filesize String to the callback

	  function save( dataBlob, filesize ){
		  FileSaver.saveAs( dataBlob, label+".png" ); // FileSaver.js function
	  }
  });
  d3.select('#pngText').on('click', function(){
    var svgString = getSVGString(chart.svg.node());
	  svgString2Image( svgString, 2*chart.width, 2*chart.height, 'png', save ); // passes Blob and filesize String to the callback

	  function save( dataBlob, filesize ){
		  FileSaver.saveAs( dataBlob, label+".png" ); // FileSaver.js function
	  }
  });

  d3.select("#svgButton")
    .on("click", function() { writeSVGDownloadLink(label); } );
  d3.select("#svgText")
    .on("click", function() { writeSVGDownloadLink(label); } );
}

function draw_assignment_ribbon(chart)
{
  console.log("Drawing ASSIGNMENT RIBBON");
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
  biod3_genericxyLineChart(data, 'pos', ['coil','helix', 'strand'],
                           ['DimGrey', 'HotPink', 'Gold'], {
                           assignment_ribbon: true,
                           download_buttons: true,});
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
      .attr("fill", "none")
      .attr('stroke', 'steelblue');
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
