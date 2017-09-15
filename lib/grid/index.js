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
  const scales = setScale(chart, [1,xdimension], [1, ydimension], ydimension*(15+4), xdimension, cell_number);
  drawAxis(chart, 'axes', scales.x, scales.y, scales.y_right, ydimension*(15+4));

  update(chart, data, scales, xdimension);

}

function update(chart, data, scales, xdimension) {
  let y_pos = 0;
  let cell_count = 0;
  var rect = chart.container.selectAll(".rect")
    .data(data);
  rect.enter().append("rect")
    .attr("class", "rect")
    .attr("width", 19)
    .attr("height", 19)
    .attr("transform", function(d) { if(cell_count == xdimension)
                                     {
                                        cell_count = 0;
                                        y_pos+=20;
                                     }
                                     cell_count+=1;
        return "translate(" +[scales.x(cell_count), y_pos]+ ")"; })
    .attr("fill", "pink");

  // here we should test what kind of grid colour we have.
    // heatmap
    // ss
    // custoom

  rect.exit().transition()
    .remove();
  if(chart.grid_label)
  {
      y_pos = 13;
      cell_count = 0;
      var text = chart.container.selectAll(".text")
        .data(data);
      text.enter().append("text")
        .attr("transform", function(d) {
                                         if(cell_count == xdimension)
                                         {
                                            cell_count = 0;
                                            y_pos+=20;
                                         }
                                         cell_count+=1;
            return "translate(" +[scales.x(cell_count)+7, y_pos]+ ")"; })
        .text( function (d) { return d.res; })
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "black");
      text.exit().transition()
        .remove();
  }
}

function drawAxis(chart, layer, x, y, yR, y_height)
{
  const xAxis = d3.axisBottom().scale(x);
  const xTAxis = d3.axisTop().scale(x);
  const yAxis = d3.axisLeft().scale(y);
  const yRAxis = d3.axisRight().scale(yR);
  chart[layer].append('g')
  .attr('class', 'axis y')
  .attr('transform', 'translate('+[chart.margin.left, chart.margin.top]+')')
  .call(yAxis)
  .select(".domain").remove();

  chart[layer].append('g')
  .attr('class', 'axis y')
  .attr('transform', 'translate('+[(chart.container_width-chart.margin.right), chart.margin.top]+')')
  .call(yRAxis)
  .selectAll(".domain").remove();

  chart[layer].append('g')
  .attr('class', 'axis x')
  .attr('transform', 'translate('+[chart.margin.left, y_height+chart.margin.top]+')')
  .call(xAxis)
  .selectAll(".domain").remove();

  chart[layer].append('g')
  .attr('class', 'axis x')
  .attr('transform', 'translate('+[chart.margin.left, chart.margin.top]+')')
  .call(xTAxis)
  .selectAll(".domain").remove();

  chart[layer].selectAll("line").remove();
}

function setScale(chart, xVals, yVals, yExtent, xdimension, cell_number){
  const x = d3.scaleBand().range([0, chart.container_width - chart.margin.left - chart.margin.right])
    .domain(returnRange(xVals[0], xVals[1]));
  let y_range = returnRange(yVals[0], yVals[1]);
  y_range.forEach(function(value, i) { if(value == 1) {y_range[i] = 1;}
                                       else {y_range[i] = ((value-1)*xdimension)+1; }
  });
  const y = d3.scaleBand().range([0, yExtent])
    .domain(y_range);

  let y_range_right = returnRange(yVals[0], yVals[1]);
  y_range_right.forEach(function(value, i) { y_range_right[i]=value*xdimension;
                                             if(i === y_range_right.length-1)
                                             { y_range_right[i]=cell_number;}
  });
  const y_right = d3.scaleBand().range([0, yExtent])
    .domain(y_range_right);

  return {x, y, y_right};
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
