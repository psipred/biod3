import {select as d3Select } from 'd3-selection';
import * as d3 from 'd3';
require('/scratch0/NOT_BACKED_UP/dbuchan/Code/biod3/node_modules/blueimp-canvas-to-blob');
//require('/Users/dbuchan/Code/biod3/node_modules/blueimp-canvas-to-blob');
const FileSaver = require('/scratch0/NOT_BACKED_UP/dbuchan/Code/biod3/node_modules/file-saver');
//const FileSaver = require('/Users/dbuchan/Code/biod3/node_modules/file-saver');

const protoChart = {
  width: window.innerWidth,
  height: window.innerHeight,
  container_width: window.innerWidth,
  container_height: window.innerHeight,
  parent: 'body',
  key_panel: true,
  y_axis_label: false,
  x_axis_label: false,
  ribbon_label: false,
  y_cutoff: false,
  x_cutoff: false,
  x_cutoff_text: "Cutoff",
  y_cutoff_text: "Cutoff",
  assignment_ribbon: false,
  assignment_label: '',
  download_buttons: false,
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
  chart.tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute");

  chart.svg = d3Select(chart.parent)
    .append('svg')
    .attr('id', chart.id || 'chart')
    .attr('width', chart.width)
    .attr('height', chart.height);

  chart.svg
    .style("text-rendering", "optimizeLegibility")
    .style("shape-rendering", "default")
    .style("font-family", "sans-serif");

  if(chart.download_buttons)
  {
    chart.key_panel = true;
  }
  if(chart.key_panel)
  {
    chart.container_width = chart.container_width - (chart.container_width * 0.2);
  }
  if(chart.container_width < (chart.margin.left+chart.margin.right))
  {
    chart.container_width = chart.margin.left+chart.margin.right+10;
  }
  if(chart.assignment_ribbon)
  {
    chart.container_height = chart.container_height - (chart.container_height * 0.2);
  }

  chart.container = chart.svg.append('g')
    .attr('id', 'container')
    .attr('width', chart.container_width - chart.margin.left - chart.margin.right)
    .attr('height', chart.height - chart.margin.top - chart.margin.bottom )
    .attr('transform', 'translate('+[chart.margin.left, chart.margin.top]+')');

  chart.axes = chart.svg.append('g')
    .attr('id', 'axes')
    .attr("width", chart.container_width - chart.margin.left - chart.margin.right)
    .attr("height", chart.height);

  chart.key = chart.svg.append('g')
    .attr('id', 'key')
    .attr("width", (chart.width * 0.2) - chart.margin.left - chart.margin.right)
    .attr("height", chart.height)
    .attr('transform', 'translate('+[chart.container_width, chart.margin.top]+')');

  chart.buttons = chart.svg.append('g')
    .attr('id', 'buttons')
    .attr("width", (chart.width * 0.2) - chart.margin.left - chart.margin.right)
    .attr("height", chart.height)
    .attr('transform', 'translate('+[chart.container_width, chart.height-(chart.margin.bottom*2)]+')');

  chart.ribbon = chart.svg.append('g')
    .attr('id', 'ribbon')
    .attr("width", chart.container_width - chart.margin.left - chart.margin.right)
    .attr("height", chart.margin.top)
    .attr('transform', 'translate('+[chart.margin.left, 0]+')');

  return chart;
}

//
//
// HELPER FUNCTIONS FOR 2nd ORDER BEHAVIOURS (download buttons mostly)
//
//

// Functions for converting an SVG canvas element to PNG as pre-configured
// http://bl.ocks.org/Rokotyan/0556f8facbaf344507cdc45dc3622177
//
export function getSVGString( svgNode ) {
	svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
	var cssStyleText = getCSSStyles( svgNode );
	appendCSS( cssStyleText, svgNode );

	var serializer = new XMLSerializer();
	var svgString = serializer.serializeToString(svgNode);
	svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
	svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

	return svgString;

	function getCSSStyles( parentElement ) {
		var selectorTextArr = [];

		// Add Parent element Id and Classes to the list
		selectorTextArr.push( '#'+parentElement.id );
		for (var c = 0; c < parentElement.classList.length; c++)
				if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
					selectorTextArr.push( '.'+parentElement.classList[c] );

		// Add Children element Ids and Classes to the list
		var nodes = parentElement.getElementsByTagName("*");
		for (var i = 0; i < nodes.length; i++) {
			var id = nodes[i].id;
			if ( !contains('#'+id, selectorTextArr) )
				selectorTextArr.push( '#'+id );

			var classes = nodes[i].classList;
			for (let c = 0; c < classes.length; c++)
				if ( !contains('.'+classes[c], selectorTextArr) )
					selectorTextArr.push( '.'+classes[c] );
		}

		// Extract CSS Rules
		var extractedCSSText = "";
		for (let i = 0; i < document.styleSheets.length; i++) {
			var s = document.styleSheets[i];

			try {
			    if(!s.cssRules) continue;
			} catch( e ) {
		    		if(e.name !== 'SecurityError') throw e; // for Firefox
		    		continue;
		    	}

			var cssRules = s.cssRules;
			for (var r = 0; r < cssRules.length; r++) {
				if ( contains( cssRules[r].selectorText, selectorTextArr ) )
					extractedCSSText += cssRules[r].cssText;
			}
		}


		return extractedCSSText;

		function contains(str,arr) {
			return arr.indexOf( str ) === -1 ? false : true;
		}

	}

	function appendCSS( cssText, element ) {
		var styleElement = document.createElement("style");
		styleElement.setAttribute("type","text/css");
		styleElement.innerHTML = cssText;
		var refNode = element.hasChildNodes() ? element.children[0] : null;
		element.insertBefore( styleElement, refNode );
	}
}


export function svgString2Image( svgString, width, height, format, callback ) {
	format = format ? format : 'png';

	var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");

	canvas.width = width;
	canvas.height = height;

	var image = new Image();
	image.onload = function() {
		context.clearRect ( 0, 0, width, height );
		context.drawImage(image, 0, 0, width, height);

		canvas.toBlob( function(blob) {
			var filesize = Math.round( blob.length/1024 ) + ' KB';
			if ( callback ) callback( blob, filesize );
		});


	};
	image.src = imgsrc;
}

// adpated from
// http://bl.ocks.org/wboykinm/e6e222d71e9b59e8b3053e0c4fe83daf
export function writeSVGDownloadLink(label){
    try {
        let isFileSaverSupported = !!new Blob();
    } catch (e) {
        alert("blob not supported");
    }

    let html = d3.select("svg")
        .attr("title", label)
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;
    html = html.substring(html.indexOf("<svg")); // if there is any cruft before the leading <svg> we get rid of it
    let blob = new Blob([html], {type: "image/svg+xml"});
    FileSaver.saveAs(blob, label+".svg");
}

// assuming your chart has a chart.buttons this will add a pair of
// buttons to the page.
// type: string with the label name (svg or png), also used for css
// xoffset: how far to the right the SVG button should be
export function button_helper(chart, type, xoffset)
{
  chart.buttons.append("rect")
   .attr('x', xoffset)
   .attr('id', type+'Button')
   .attr('width', 70)
   .attr('height', 20)
   .attr('class', type+'button')
   .on('mouseover', function(){
      d3.select('#'+type+'Button')
        .attr('fill', '')
        .classed('active', true);
      d3.select('#'+type+'Text')
        .attr('fill', '')
        .classed('active', true);})
    .on('mouseout', function(){
      d3.select('#'+type+'Button')
        .classed('active', false);
      d3.select('#'+type+'Text')
        .classed('active', false);
   });

  chart.buttons.append("text")
    .attr('id', type+'Text')
    .attr('class', 'buttonText')
    .attr("x", 10+xoffset)
    .attr("y", 10)
    .attr("dy", ".35em")
    .text("Get "+type.toUpperCase())
    .on('mouseover', function(){
        d3.select('#'+type+'Button')
          .attr('fill', '')
          .classed('active', true);
        d3.select('#'+type+'Text')
          .attr('fill', '')
          .classed('active', true);})
    .on('mouseout', function(){
        d3.select('#'+type+'Button')
          .classed('active', false);
        d3.select('#'+type+'Text')
          .classed('active', false);
    });
 }

// takes a chart and a string for the file name and handles the user interaction
// to return a file
// Some parts of this function adapted from
// http://bl.ocks.org/Rokotyan/0556f8facbaf344507cdc45dc3622177
export function save_handler(chart, label)
{
    save_helper(chart, 'Button', label);
    save_helper(chart, 'Text', label);
}
function save_helper(chart, type, label)
{
  d3.select('#png'+type).on('click', function(){
    var svgString = getSVGString(chart.svg.node());
    svgString2Image( svgString, 2*chart.width, 2*chart.height, 'png', save ); // passes Blob and filesize String to the callback

    function save( dataBlob, filesize ){
      FileSaver.saveAs( dataBlob, label+".png" ); // FileSaver.js function
    }
  });
  d3.select("#svg"+type)
    .on("click", function() { writeSVGDownloadLink(label); } );
}

// sort and array of objects by an inner key
export function keysrt(arr, key, reverse) {
    var sortOrder = 1;
    if(reverse){
        sortOrder = -1;
    }
    return arr.sort(function(a, b) {
        var x = a[key],
            y = b[key];

        return sortOrder * ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
