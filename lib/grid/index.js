import * as d3 from 'd3';
import 'd3-transition';
//import 'd3.layout.grid';
// import {event as currentEvent} from 'd3-selection'; //re-import this due to d3-transition clash
// import legend from 'd3-svg-legend';
import { chartFactory } from '../common/index';
import { button_helper } from '../common/index';
import { save_handler } from '../common/index';
const d3grid = require('./d3-grid.js');
const FileSaver = require('/scratch0/NOT_BACKED_UP/dbuchan/Code/biod3/node_modules/file-saver');


// We make use of:
// https://www.npmjs.com/package/d3.layout.grid
//
// Take data in this format
// [
//   {ss: 'A', }
//   {ss: 'T', }
// ]
//
// cellseries: the labels for each cell (and there will be a many cells as rows)
// xdimension: the number of cells per row
export function biod3_genericGrid(data, cellseries, xdimension, opts={})
{
  opts = Object.assign(opts, {margin: {top: 80, bottom: 80, right: 80, left: 80}});
  const chart = chartFactory(opts);

  const cell_number = data.length;
  const ydimension = Math.ceil(cell_number/xdimension);
  const scales = setScale(chart, [1,xdimension], [1, ydimension], chart.height - chart.margin.bottom * 2);
  drawAxis(chart, 'axes', scales.x, scales.y);
  // actualSize[0] = x.bandwidth()-10;
  // actualSize[1] = y.bandwidth()-10;


  // var tick = setInterval(push, 0);
  // var rects = [];
  // //var tick = setInterval(pop, 0);
  // function update() {
  //     var rect = chart.container.selectAll(".rect")
  //     .data(chart.container.rectGrid(rects));
  //
  //   rect.enter().append("rect")
  //     .attr("class", "rect")
  //     .attr("width", 10)
  //     .attr("height", 10)
  //     .attr("transform", function(d) { return "translate(" + (d.x)+ "," + d.y + ")"; })
  //   rect.exit().transition()
  //     .remove();
  // }
  //
  // function push() {
  //   rects.push({});
  //   update();
  // }
  //
  // function pop() {
  //   rects.pop();
  //   update();
  // }
}

function drawAxis(chart, layer, x, y)
{
  const xAxis = d3.axisBottom().scale(x);
  const yAxis = d3.axisLeft().scale(y);
  chart[layer].append('g')
  .attr('class', 'axis y')
  .attr('transform', 'translate('+[chart.margin.left, chart.margin.top]+')')
  .call(yAxis);
  if(chart.y_axis_label)
  {
   chart.container.append("text")
    // .attr("transform", "translate(" + (chart.width/2) + " ," +
    //                      (chart.height + chart.margin.top + 20) + ")")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - (chart.margin.left/2))
    .attr("x",0 - (chart.container_height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(chart.y_axis_label);
  }


  chart[layer].append('g')
  .attr('class', 'axis x')
  .attr('transform', 'translate('+[chart.margin.left, chart.height-chart.margin.bottom]+')')
  .call(xAxis);
  if(chart.x_axis_label)
  {
   chart.container.append("text")
    .attr("transform",
          "translate(" + (chart.container_width/2) + " ," +
                         (chart.container_height + chart.margin.bottom/2) + ")")
    .style("text-anchor", "middle")
    .text(chart.x_axis_label);
  }
}

function setScale(chart, xVals, yVals, yExtent){
  const x = d3.scaleBand().range([0, chart.container_width - chart.margin.left - chart.margin.right])
    .domain(returnRange(xVals[0], xVals[1]));
  const y = d3.scaleBand().range([yExtent, 0])
    .domain(returnRange(yVals[0], yVals[1]));
  return {x, y};
}

function returnRange(n, m)
{
  let tmp = [];
  for(var i = n; i <= m; i++)
  {
    tmp.push(i);
  }
  return(tmp);
}
