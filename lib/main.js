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

function drawChart(error, exampleSS){
  //const xyData = exampleSS.reduce(function (arr, val) { return arr.concat({x: val.pos, y: val.coil}); }, []);
  //biod3_xyLineChart(xyData);

  //biod3_psipredxyLineChart(exampleSS);
  //biod3_genericxyLineChart(exampleSS, 'pos', ['coil','helix'], ['DimGrey', 'HotPink', 'Gold']);

  biod3_genericGrid(exampleSS, 'ss', 70, {grid_label: true, grid_colour: "phyre", grid_colour_values: "res" });
  //biod3_heatmap(exampleSS, 'ss', 70, 'coil', {x_labels: ['a', 'b',]} );
}

export const __hotReload = true;
