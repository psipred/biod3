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
  const scales = setScale(chart, [1,xdimension], [1, ydimension], ydimension*(15+4));
  drawAxis(chart, 'axes', scales.x, scales.y, ydimension*(15+4));

  update(chart, data, xdimension);
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

function update(chart, data, xdimension) {
  let x_pos = -10;
  let y_pos = 0;
  let res_count = 0;
  var rect = chart.container.selectAll(".rect")
    .data(data);
  rect.enter().append("rect")
    .attr("class", "rect")
    .attr("width", 19)
    .attr("height", 19)
    .attr("transform", function(d) { res_count+=1;
                                     if(res_count == 69)
                                     {
                                        res_count = 0;
                                        y_pos+=20;
                                        x_pos=0;
                                     }
        return "translate(" +[x_pos+=20, y_pos]+ ")"; })
    .attr("fill", "pink");

  rect.exit().transition()
    .remove();

  x_pos = 0;
  y_pos = 20;
  res_count = 0;
  var text = chart.container.selectAll(".text")
    .data(data);
  text.enter().append("text")
    .attr("transform", function(d) { res_count+=1;
                                     if(res_count == 69)
                                     {
                                        res_count = 0;
                                        y_pos+=20;
                                        x_pos=0;
                                     }
        return "translate(" +[x_pos+=20, y_pos]+ ")"; })
    .text( function (d) { return d.res; })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("fill", "black");
  text.exit().transition()
    .remove();
}

function drawAxis(chart, layer, x, y, y_height)
{
  const xAxis = d3.axisBottom().scale(x);
  const yAxis = d3.axisLeft().scale(y);
  chart[layer].append('g')
  .attr('class', 'axis y')
  .attr('transform', 'translate('+[chart.margin.left, chart.margin.top]+')')
  .call(yAxis);

  chart[layer].append('g')
  .attr('class', 'axis x')
  .attr('transform', 'translate('+[chart.margin.left, y_height+chart.margin.top]+')')
  .call(xAxis);
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
