// set up area for chart with margins

var svgWidth = 600;
var svgHeight = 400;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;



// Create an SVG wrapper
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



// Import Data from the csv-
d3.csv("data.csv").then(function(stateData) {
    console.log(stateData)
    stateData.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
      abbr = data.abbr;
      data.state = data.state;
    });

//set the scale of the chart(range), based on the x and y values(domain)
    var xLinearScale = d3.scaleLinear()
      .domain([2, d3.max(stateData, d => d.healthcare)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([2, d3.max(stateData, d => d.poverty)])
      .range([height, 0]);

//set the axis values
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

//append axiseses to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

//create the circle chart
  chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "12")
    .attr("fill", "#478eff")
    .attr("opacity", ".5")


//Add State abbreviations to the chart
   chartGroup.append("text")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .style("font-weight", "bold")
    .style("font-family", "arial")
    .selectAll("tspan")
    .data(stateData)
    .enter()
    .append("tspan")
        .attr("x", function(data) {
            return xLinearScale(data.healthcare - 0);
        })
        .attr("y", function(data) {
            return yLinearScale(data.poverty - 0.1);
        })
        .text(function(data) {
            return data.abbr
            });

//append tooltip div
    var toolTip = d3.select("body")
      .append("div")
      .classed("tooltip", true);
      
//mouseover to create the tooltip
    chartGroup.on("mouseover", function(data) {
      toolTip.style("display", "block")
      .html(
          `<strong>${(state)}<strong><hr>${data.healthcare}
              % without Healthcare<br>${data.poverty}% in Poverty`)
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px");
          })
//mouseout to hide the tooltip
        .on("mouseout", function() {
          toolTip.style("display", "none");
            });

// Create axiseses labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("% Population in Poverty");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 3}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("% Population Lacking Healthcare");

  }).catch(function(error) {
    console.log(error);
  });