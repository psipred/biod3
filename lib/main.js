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
E: {fill: 'Gold',},
H: {fill: 'HotPink',},
C: {fill: 'LightGrey',},
DB: {fill: '#7ebfd3'},
ED: {fill: 'Gold', stroke: 'blue'},
HD: {fill: 'HotPink', stroke: 'blue'},
CD: {fill: 'LightGrey', stroke: 'blue'},
EB: {fill: 'Gold', stroke: 'green'},
HB: {fill: 'HotPink', stroke: 'green'},
CB: {fill: 'LightGrey', stroke: 'green'},
};

const key = [
{fill: 'Gold', name: 'Strand'},
{fill: 'HotPink', name: 'Helix'},
{fill: 'LightGrey', name: 'Coil'},
{fill: '#7ebfd3', name: 'Domain Boundary'},
{stroke: 'blue', name: 'Disordered'},
{stroke: 'green', name: 'Disordered protein binding'}
];

function drawChart(error, exampleSS){
  //const xyData = exampleSS.reduce(function (arr, val) { return arr.concat({x: val.pos, y: val.coil}); }, []);
  //biod3_xyLineChart(xyData);

  //biod3_psipredxyLineChart(exampleSS);
  //biod3_genericxyLineChart(exampleSS, 'pos', ['coil','helix'], ['DimGrey', 'HotPink', 'Gold']);

  biod3_genericGrid(exampleSS, 'ss', 50, "psipredChart", {annotation_sets: ['psipred', 'lesk', 'phyre'], download_buttons: true, grid_key: key, grid_label: true, grid_colour: "custom", grid_colour_values: "psipred", custom_grid_palette: custom });
  //biod3_heatmap(exampleSS, 'ss', 70, 'coil', {x_labels: ['a', 'b',]} );
}

export const __hotReload = true;
