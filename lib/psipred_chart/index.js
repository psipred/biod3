import * as d3 from 'd3';
import 'd3-transition';
//import 'd3.layout.grid';
import {event as currentEvent} from 'd3-selection'; //re-import this due to d3-transition clash
import legend from 'd3-svg-legend';
import { chartFactory } from '../common/index';
import { button_helper } from '../common/index';
import { save_handler } from '../common/index';
import { innerArrayValues } from '../common/index';
import { returnRange } from '../common/index';
const cb = require('../common/palette.js');
const FileSaver = require('/scratch0/NOT_BACKED_UP/dbuchan/Code/biod3/node_modules/file-saver');

export function biod3_psipred(data, label="psipredChart", opts={})
{
  const xdimension = 50;
  const data_array = parseHFormat(data);
  const sets = Math.ceil(data_array.length/50)+1;
  opts = Object.assign(opts, {});
  const chart = chartFactory(opts);
  chart.height = (7*chart.em_size)*sets;
  chart.container_height = chart.height;
  const scales = setScale(chart, xdimension, 7*chart.em_size);
  drawAxis(chart, 'axes', scales.x, scales.y, 7*chart.em_size);
  drawDiagram(chart, data_array);
  drawKey(chart, data_array);
}

function setScale(chart, xdimension, ysize)
{
  const x = d3.scaleBand().range([0, chart.container_width - chart.margin.left - chart.margin.right])
    .domain(returnRange(1, xdimension));

  const y = d3.scaleBand().range([0, ysize])
    .domain(['Conf', 'Cart', 'Pred', 'AA']);
  return {x, y};
}

function drawAxis(chart, layer, x, y, ysize)
{
  const xAxis = d3.axisBottom().scale(x).tickValues(x.domain().filter(function(d,i){  return !((i+1)%10)}));;
  const yAxis = d3.axisLeft().scale(y);
  chart[layer].append('g')
  .attr('class', 'axis y')
  .attr('transform', 'translate('+[chart.margin.left, chart.margin.top]+')')
  .call(yAxis)
  .select(".domain").remove();
  chart[layer].selectAll("line").remove();

  chart[layer].append('g')
  .attr('class', 'axis x')
  .attr('transform', 'translate('+[chart.margin.left, ysize+chart.margin.top]+')')
  .call(xAxis)
  .selectAll(".domain").remove();
}

function drawDiagram(chart, data_array)
{}

function drawKey(chart, data_array)
{}

function parseHFormat(data)
{
  let parsed = [];
  const lines = data.split("\n");
  let conf = '';
  let pred = '';
  let aa = '';
  lines.forEach(function(line, i){
    conf += stripLine(line, "Conf: ");
    pred += stripLine(line, "Pred: ");
    aa += stripLine(line, "  AA: ");
  });
  aa.split("").forEach(function(char, i){
    parsed.push({aa: aa[i], pred: pred[i],conf: conf[i]});
  });
  return(parsed);
}
function stripLine(line, leader)
{
  if(line.startsWith(leader))
  {
    let re = new RegExp("^"+leader);
    return(line.replace(re, ""));
  }
  else {
    return '';
  }
}
