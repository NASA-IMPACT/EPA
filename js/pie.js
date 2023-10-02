var width = 800;
var height = 400;
var radius = Math.min(width, height) / 2;
var svg = d3.select("#pieChart")
.append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + width / 3 + "," + height / 2 + ")");
var radius = Math.min(width, height) / 2;


function pieChart(data, state, year){
    svg.select(".chart-title")
        .remove();

    // Filter the data for the selected year
    if (state=="All"){
        var filteredData = data
        .filter(d => d.Year === year ); 
        var grouped = d3.group(data, d => d.Title);
        filteredData = Array.from(grouped, ([key, values]) => ({
            Title: key, // Use "Year" instead of "key"
            TotalEmissions: d3.sum(values, d => +d.TotalEmissions) // Use "TotalEmissions" instead of "value"
        }));
        filteredData =filteredData.filter(d=> d.Title !=="Total Methane (annual)");
    }
    else{
    var filteredData = data
  .filter(d => d.Year === year) // Filter by Year
  .filter(d => d.State ===state && d.Title !== "Total Methane (annual)"); 
    }


    // Define a color scale for the pie chart segments
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // Define the pie layout
    var pie = d3.pie()
        .value(d => d.TotalEmissions);

    // Create an arc generator for the pie chart
    var arc = d3.arc()
        .innerRadius(80)
        .outerRadius(radius);

    // Generate the pie chart segments
    var arcs = svg.selectAll("arc")
        .data(pie(filteredData))
        .enter()
        .append("g")
        .attr("class", "arc");

    // Draw the pie chart segments
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.Title));

    // Add a title to the pie chart
    svg.append("text")
    .attr("class", "chart-title") 
    .attr("x", 0)
    .attr("y",  0) // Adjust the vertical position as needed
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text(state + " "+ year); // Add your title text here


    // Create a legend for the labels on the right side
    var legend = svg.append("g")
        .selectAll("legend")
        .data(filteredData)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => "translate(" + (400 / 2 + 10) + "," + (i * 20 + 10) + ")"); 

    legend.append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", d => color(d.Title.substring()));

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(d => d.Title.substring(6, d.Title.length - 9));

}
