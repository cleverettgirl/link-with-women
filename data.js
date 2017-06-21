'use strict';
function runD3(data){

  console.log("INSIDE D3: ", data)

  if(document.getElementsByClassName('tooltip')){
    d3.select('#chart').select('svg').remove()
  }

  var tooltip = d3.select('#chart')
    .append('div')
    .attr('class', 'tooltip');

  tooltip.append('div')
    .attr('class', 'label');

  tooltip.append('div')
    .attr('class', 'count');

  tooltip.append('div')
    .attr('class', 'percent');

  var width = 250;
  var height = 250;
  var radius = Math.min(width, height) / 2;

  var color = d3.scaleOrdinal(d3.schemeCategory20c);

  var svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) +
      ',' + (height / 2) + ')');

  var donutWidth = 50;

  var arc = d3.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);

  var pie = d3.pie()
    .value(function(d) { return d.value; })
    .sort(null);

  var legendRectSize = 18;
  var legendSpacing = 4;

  var path = svg.selectAll('path')
    .data(pie(dataset))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d, i) {
      return color(d.data.gender);

    });

  path.on('mouseover', function(d) {
    var total = d3.sum(dataset.map(function(d) {
      return d.value;
  }));

  var percent = Math.round(1000 * d.data.value / total) / 10;
    tooltip.select('.label').html(d.data.gender);
    tooltip.select('.count').html(d.data.value);
    tooltip.select('.percent').html(percent + '%');
    tooltip.style('display', 'block');
  });

  path.on('mouseout', function() {
    tooltip.style('display', 'none');
  });

  var legend = svg.selectAll('.legend')
  .data(color.domain())
  .enter()
  .append('g')
  .attr('class', 'legend')
  .attr('transform', function(d, i) {
    var height = legendRectSize + legendSpacing;
    var offset =  height * color.domain().length / 2;
    var horz = -2 * legendRectSize;
    var vert = i * height - offset;
    return 'translate(' + horz + ',' + vert + ')';
  });

  legend.append('rect')
  .attr('width', legendRectSize)
  .attr('height', legendRectSize)
  .style('fill', color)
  .style('stroke', color);

  legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function(d) { return d; });

  something()

}

function something(){
  var head = document.getElementsByTagName("head");
  var script = document.createElement("script");

  // script.onload = runD3();
  script.onerror = function () { alert('Failed to load D3.') };
  script.src = "http://d3js.org/d3.v3.min.js";
  script.charset = "utf-8";
  // head.appendChild(script);
  console.log('script', script)
}
