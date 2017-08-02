import {select as d3Select } from 'd3-selection';
import * as d3 from 'd3';

const protoChart = {
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'body',
  margin: {
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
  },
};

//
// Builds a panel to put a chart in given the prototype Object
// Call With
// const chart = chartFactory()
// Override with
// const chart = chartFactory({margin: {top: 20, bottom: 20, right: 20, left: 20}})
//
export function chartFactory(opts, proto = protoChart) {
  const chart = Object.assign({}, proto, opts);

  chart.svg = d3Select(chart.parent)
    .append('svg')
    .attr('id', chart.id || 'chart')
    .attr('width', chart.width)
    .attr('height', chart.height);

  chart.container = chart.svg.append('g')
    .attr('id', 'container')
    .attr('width', chart.width - chart.margin.left - chart.margin.right)
    .attr('height', chart.height - chart.margin.top - chart.margin.bottom )
    .attr('transform', 'translate('+[chart.margin.left, chart.margin.top]+')');

  chart.axes = chart.svg.append('g')
    .attr('id', 'axes')
    .attr("width", chart.width - chart.margin.left - chart.margin.right)
    .attr("height", chart.height);

  return chart;
}
