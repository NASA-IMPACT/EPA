


// function pieChart(data, state, year){
//     svg.selectAll("*").remove();
//     if (state=="All"){
//         var filteredData = data
//         .filter(d => d.Year === year ); 
//         var grouped = d3.group(data, d => d.Title);
//         filteredData = Array.from(grouped, ([key, values]) => ({
//             Title: key, // Use "Year" instead of "key"
//             TotalEmissions: d3.sum(values, d => +d.TotalEmissions) // Use "TotalEmissions" instead of "value"
//         }));
//         filteredData =filteredData.filter(d=> d.Title !=="Total Methane (annual)");
//     }
//     else{
//     var filteredData = data
//   .filter(d => d.Year === year) // Filter by Year
//   .filter(d => d.State ===state && d.Title !== "Total Methane (annual)"); 
//     }


//     // Define a color scale for the pie chart segments
//     var color = d3.scaleOrdinal(d3.schemeCategory10);

//     // Define the pie layout
//     var pie = d3.pie()
//         .value(d => d.TotalEmissions);

//     // Create an arc generator for the pie chart
//     var arc = d3.arc()
//         .innerRadius(80)
//         .outerRadius(radius);


//     var arcs = svg.selectAll("arc")
//     .data(pie(filteredData))
//     .enter()
//     .append("g")
//     .attr("class", "arc")
//     .on("mouseover", function (event, d) {
//         // Enlarge the pie chart segment on hover
//         d3.select(this).transition()
//         .duration(200)
//         .attr("transform", function (d) {
//             var angle = (d.startAngle + d.endAngle) / 2;
//             var xOffset = Math.sin(angle) * 20;
//             var yOffset = -Math.cos(angle) * 20;
//             return "translate(" + xOffset + "," + yOffset + ")";
//         });

//         // Highlight the segment by changing the stroke to #FDFF32
//         // d3.select(this).select("path")
//         // .attr("stroke", "#fdff32") // Change the stroke color to #FDFF32
//         // .attr("stroke-width", 4); // Adjust the stroke width

//         d3.select(this).select("path")
//         .attr("stroke", "black") // Change the stroke color to #FDFF32
//         .attr("stroke-width", 3); // Adjust the stroke width

//         // Display the percentage and TotalEmissions in a popup
//         var percentage = ((d.data.TotalEmissions / d3.sum(filteredData, function (d) {
//         return d.TotalEmissions;
//         })) * 100).toFixed(2);
//         d3.select("#popup").text(percentage + "%").style("visibility", "visible");
//     })
//     .on("mouseout", function (event, d) {
//         // Restore the pie chart segment to its original position
//         d3.select(this).transition()
//         .duration(200)
//         .attr("transform", "translate(0,0)");

//         // Remove the stroke when the mouse pointer moves away
//         d3.select(this).select("path")
//         .attr("stroke", "none"); // Remove the stroke

//         // Hide the percentage popup on mouseout
//         d3.select("#popup").style("visibility", "hidden");
//         });

//     svg.append("text")
//     .attr("id", "popup")
//     .attr("x", 0)
//     .attr("y", 50) // Adjust the vertical position as needed
//     .attr("text-anchor", "middle")
//     .style("font-size", "16px")
//     .style("font-weight", "bold")
//     .style("visibility", "hidden"); 

//     // Draw the pie chart segments
//     arcs.append("path")
//         .attr("d", arc)
//         .attr("fill", d => color(d.data.Title));

//     // Add a title to the pie chart
//     svg.append("text")
//     .attr("class", "chart-title") 
//     .attr("x", 0)
//     .attr("y",  0) // Adjust the vertical position as needed
//     .attr("text-anchor", "middle")
//     .style("font-size", "16px")
//     .style("font-weight", "bold")
//     .text(state + " "+ year); // Add your title text here


//     // Create a legend for the labels on the right side
//     var legend = svg.append("g")
//         .selectAll("legend")
//         .data(filteredData)
//         .enter()
//         .append("g")
//         .attr("class", "legend")
//         .attr("transform", (d, i) => "translate(" + (500 / 2 + 10) + "," + (i * 20 + 10) + ")"); 

//     legend.append("rect")
//         .attr("x", 0)
//         .attr("width", 18)
//         .attr("height", 18)
//         .attr("fill", d => color(d.Title.substring()));

//     legend.append("text")
//         .attr("x", 24)
//         .attr("y", 9)
//         .attr("dy", ".35em")
//         .style("text-anchor", "start")
//         .text(d => d.Title.substring(6, d.Title.length - 9));

// }



var width = 800;
var height = 400;
var radius = Math.min(width, height) / 2;
var svg = d3.select("#pieChart")
.append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + width /  + "," + height /2  + ")");
var radius = Math.min(width, height) / 2;
function pieChart(data, state, year) {
    svg.selectAll("*").remove();
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
  
    // Your existing data filtering logic
  
    // Define a color scale for the bar chart segments
    var color = d3.scaleOrdinal(d3.schemeCategory10);
  
    // Create an x scale for the bars
    var x = d3.scaleBand()
      .domain(filteredData.map(d => d.Title))
      .range([0, width])
      .padding(0.1);
  
    // Create a y scale for the bars
    var y = d3.scaleLinear()
    .domain([0, d3.max(filteredData, d => d.TotalEmissions * 1.1)]) // Add some padding to the domain

      .range([height, 0]);
  
    // Append the bars to the chart
    svg.selectAll("rect")
      .data(filteredData)
      .enter()
      .append("rect")
      .attr("x", d => x(d.Title))
      .attr("y", d => y(d.TotalEmissions))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.TotalEmissions))
      .attr("fill", d => color(d.Title))
      .on("mouseover", function (event, d) {
        var percentage = ((d.TotalEmissions / d3.sum(filteredData, d => d.TotalEmissions)) * 100).toFixed(2);
        d3.select("#popup")
          .text(percentage + "%")
          .attr("x", x(d.Title) + x.bandwidth() / 2) // Position the text at the center of the bar
          .attr("y", y(d.TotalEmissions) - 10) // Adjust the vertical position
          .style("visibility", "visible");
        
        // Highlight the selected bar by adding a black border
        d3.select(this)
          .attr("stroke", "black")
          .attr("stroke-width", 2);
      })
      .on("mouseout", function () {
        // Remove the black border on mouseout
        d3.select(this).attr("stroke", "none");
        
        // Hide the percentage popup on mouseout
        d3.select("#popup").style("visibility", "hidden");
      });
  
    // Title
    svg.append("text")
    .attr("class", "chart-title") 
    .attr("x", 400)
    .attr("y",  15) 
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Contribution to emissions in "+state +" state"+ "-"+ year); 
  
    // Legend
    var legend = svg.append("g")
      .selectAll("legend")
      .data(filteredData)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => "translate(" + (width -800) + "," + (i * 20 ) + ")");
  
    legend.append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", d => color(d.Title));
  
    legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(d => d.Title.substring(6, d.Title.length - 9));
  
    // Percentage Popup
    svg.append("text")
      .attr("id", "popup")
      .attr("x", width / 2)
      .attr("y", 50) // Adjust the vertical position as needed
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("visibility", "hidden");
  
  }