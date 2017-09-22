import * as d3 from 'd3';
import 'd3-transition';
//import 'd3.layout.grid';
import {event as currentEvent} from 'd3-selection'; //re-import this due to d3-transition clash
// import legend from 'd3-svg-legend';
import { chartFactory } from '../common/index';
import { button_helper } from '../common/index';
import { save_handler } from '../common/index';
import { innerArrayValues } from '../common/index';
const cb = require('../common/palette.js');
const FileSaver = require('/scratch0/NOT_BACKED_UP/dbuchan/Code/biod3/node_modules/file-saver');

export function biod3_heatmap(data, cellseries, xdimension, colour_values, opts={})
{
  let heatmap_opts = {grid_label: false, grid_colour: "heatmap", grid_colour_values: colour_values };
  heatmap_opts = Object.assign(heatmap_opts, opts);
  biod3_genericGrid(data, cellseries, xdimension, heatmap_opts);
}

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
  const scales = setScale(chart, [1,xdimension], [1, ydimension], ydimension*(15+4), xdimension, ydimension, cell_number);
  drawAxis(chart, 'axes', scales.x, scales.y, scales.x_top, scales.y_right, ydimension*(15+4));

  update(chart, data, scales, xdimension);

}

function update(chart, data, scales, xdimension) {
  //console.log(cb.colorbrewer.RdYlGn[11]);
  let y_pos = 0;
  let cell_count = 0;

  let heatmapColour = d3.scaleLinear()
  .domain(d3.range(0, 1, 1.0 / (cb.colorbrewer.RdYlGn[11].length - 1)))
  .range(cb.colorbrewer.RdYlGn[11]);
  let c = d3.scaleLinear().domain(d3.extent(innerArrayValues(data, chart.grid_colour_values))).range([0,1]);

  let rollOverText = function(d, i) {  if(chart.grid_colour && chart.grid_colour_values)
                          {
                            if(chart.grid_colour === "heatmap")
                            {
                              return (i+1)+": "+d[chart.grid_colour_values];
                            }
                            if(chart.grid_colour === "lesk" || chart.grid_colour === "phyre" ||
                               chart.grid_colour === "clustal" || chart.grid_colour === "taylor" ||
                               chart.grid_colour === "secondary_structure" || chart.grid_colour === "transmembrane" ||
                               chart.grid_colour === "custom")
                            {
                              return chart.grid_colour_values+": "+d[chart.grid_colour_values];
                            }

                          }};
  if(chart.custom_grid_palette)
  {
    cb.custom = chart.custom_grid_palette;
  }

  let rect = chart.container.selectAll(".rect")
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
    .attr("fill", function(d) { let colour = "white";
                                if(chart.grid_colour && chart.grid_colour_values)
                                {
                                  if(chart.grid_colour === "heatmap")
                                  {
                                      return heatmapColour(c(d[chart.grid_colour_values]));
                                  }
                                  if(chart.grid_colour === "lesk" || chart.grid_colour === "phyre" ||
                                     chart.grid_colour === "clustal" || chart.grid_colour === "taylor" ||
                                     chart.grid_colour === "secondary_structure" || chart.grid_colour === "transmembrane" ||
                                     chart.grid_colour === "custom")
                                  {
                                      if(cb[chart.grid_colour].hasOwnProperty(d[chart.grid_colour_values]) )
                                      {
                                        if(cb[chart.grid_colour][d[chart.grid_colour_values]].hasOwnProperty("fill"))
                                        {
                                           colour = cb[chart.grid_colour][d[chart.grid_colour_values]].fill;
                                        }
                                      }
                                  }
                                }
                                return(colour);
                                })
    .attr("stroke", function(d) { let colour = "white";
                                if(chart.grid_colour && chart.grid_colour_values)
                                {
                                  if(chart.grid_colour === "lesk" || chart.grid_colour === "phyre" ||
                                     chart.grid_colour === "clustal" || chart.grid_colour === "taylor" ||
                                     chart.grid_colour === "secondary_structure" || chart.grid_colour === "transmembrane"||
                                     chart.grid_colour === "custom")
                                  {
                                      if(cb[chart.grid_colour].hasOwnProperty(d[chart.grid_colour_values]) )
                                      {
                                        if(cb[chart.grid_colour][d[chart.grid_colour_values]].hasOwnProperty("stroke"))
                                        {
                                           colour = cb[chart.grid_colour][d[chart.grid_colour_values]].stroke;
                                        }
                                      }
                                  }
                                }
                                return(colour);
                              })
    .append("svg:title").text(rollOverText);
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
            return "translate(" +[scales.x(cell_count)+5, y_pos]+ ")"; })
        .text( function (d) { return d.res; })
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
    .append("svg:title").text(rollOverText);
      text.exit().transition()
        .remove();
  }
}

function drawAxis(chart, layer, x, y, xT, yR, y_height)
{
  const xAxis = d3.axisBottom().scale(x);
  const xTAxis = d3.axisTop().scale(xT);
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

  let tx = chart[layer].append('g')
  .attr('class', 'axis x')
  .attr('transform', 'translate('+[chart.margin.left, chart.margin.top]+')')
  .call(xTAxis);
  if(chart.x_labels)
  {
    tx.selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(-60)")
    .style("text-anchor", "start");
  }
  tx.selectAll(".domain").remove();
  chart[layer].selectAll("line").remove();
}

function setScale(chart, xVals, yVals, yExtent, xdimension, ydimension, cell_number){
  const x = d3.scaleBand().range([0, chart.container_width - chart.margin.left - chart.margin.right])
    .domain(returnRange(xVals[0], xVals[1]));

  let y_range = returnRange(yVals[0], yVals[1]);
  y_range.forEach(function(value, i) { if(value == 1) {y_range[i] = 1;}
                                       else {y_range[i] = ((value-1)*xdimension)+1; }
  });
  const y = d3.scaleBand().range([0, yExtent])
    .domain(y_range);

  let x_top = d3.scaleBand().range([0, chart.container_width - chart.margin.left - chart.margin.right])
    .domain(returnRange(xVals[0], xVals[1]));
  if(chart.x_labels)
  {
    let xlabels = [];
    if(chart.x_labels.length < xdimension)
    {
      let label_count = -1;
      for(let i = 0; i <= xdimension; i+=1)
      {
        if(i % chart.x_labels.length === 0){label_count+=1;}
        xlabels.push(chart.x_labels[i % chart.x_labels.length]+"_"+label_count);
      }
    }
    else
    {
      xlabels = chart.x_labels;
    }
    x_top = d3.scaleBand().range([0, chart.container_width - chart.margin.left - chart.margin.right])
    .domain(xlabels.slice(0, xdimension));
  }

  let y_range_right = returnRange(yVals[0], yVals[1]);
  y_range_right.forEach(function(value, i) { y_range_right[i]=value*xdimension;
                                             if(i === y_range_right.length-1)
                                             { y_range_right[i]=cell_number;}
  });
  let y_right = d3.scaleBand().range([0, yExtent])
    .domain(y_range_right);
  if(chart.y_labels)
  {
    let ylabels = [];
    if(chart.y_labels.length < ydimension)
    {
      let label_count = -1;
      for(let i = 0; i <= ydimension; i+=1)
      {
        if(i % chart.y_labels.length === 0){label_count+=1;}
        ylabels.push(chart.y_labels[i % chart.y_labels.length]+"_"+label_count);
      }
    }
    else
    {
      ylabels = chart.y_labels;
    }
    y_right = d3.scaleBand().range([0, yExtent])
    .domain(ylabels.slice(0, ydimension));
  }
  return {x, y, x_top, y_right};
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
