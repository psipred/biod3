import * as d3 from 'd3';
import '../styles/index.css';
import { biod3_xyLineChart } from './line_chart/index.js';
import { biod3_psipredxyLineChart } from './line_chart/index.js';
import { biod3_genericxyLineChart } from './line_chart/index.js';
import { biod3_genericGrid } from './grid/index.js';
import { biod3_heatmap} from './grid/index.js';

d3.queue()
  .defer(d3.csv, '../test_data/example.ss')
  .await(drawChart);

const custom = {
E: {fill: 'Gold', name: 'Strand'},
H: {fill: 'HotPink', name: 'Helix'},
C: {fill: 'LightGrey', name: 'Coil'},
D: {stroke: 'blue', name: 'Disordered'},
PB: {stroke: 'green', name: 'Disordered, protein binding'},
B: {fill: '#7ebfd3', name: 'Putative Domain Boundary'},
};

function drawChart(error, exampleSS){
  //const xyData = exampleSS.reduce(function (arr, val) { return arr.concat({x: val.pos, y: val.coil}); }, []);
  //biod3_xyLineChart(xyData);

  //biod3_psipredxyLineChart(exampleSS);
  //biod3_genericxyLineChart(exampleSS, 'pos', ['coil','helix'], ['DimGrey', 'HotPink', 'Gold']);

  biod3_genericGrid(exampleSS, 'ss', 50, "psipredChart", {annotation_sets: ['lesk', 'clustal', 'phyre'], download_buttons: true, grid_label: true, grid_colour_type: "custom", grid_colour_annotations: ["ss", "disopred", "dompred"], custom_grid_palette: custom });
  //biod3_heatmap(exampleSS, 'ss', 70, 'coil', {x_labels: ['a', 'b',]} );
}

export const __hotReload = true;
