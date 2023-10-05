// set the dimensions and margins of the graph
var marginB = {top: 20, right: 30, bottom: 40, left: 90},
widthB =600 - marginB.left - marginB.right,
heightB = 400 - marginB.top - marginB.bottom;


// append the svg object to the body of the page
var svgB = d3.select("#barChart")
.append("svg")
.attr("width", widthB + marginB.left + marginB.right)
.attr("height", heightB + marginB.top + marginB.bottom)
.append("g")
.attr("transform",
    "translate(" + marginB.left + "," + marginB.top + ")");

function barChart(yearly, state, title){
    svgB.selectAll("*").remove();
    var minTotalEmissions = d3.min(yearly, d => parseInt(d.total));
    var yearly = yearly.map(function(d) {
        return {
            Year: d.Year,
            total: d.total,
            diff: d.total - minTotalEmissions + 1000
        };
    });

    var maxTotalEmissions = d3.max(yearly, d => d.diff);
    svgB.append("text")
        .attr("class", "bar-title") 
        .attr("x", widthB / 2)
        .attr("y", 0) 
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Yearly "+ title+ " Emissions "+ state); 

    // Add X axis
    var x = d3.scaleLinear()
    .domain([0, maxTotalEmissions])
    .range([0, widthB]);
    // svgB.append("g")
    // .attr("class", "x-axis")
    // .attr("transform", "translate(0," + heightB + ")")
    // .call(d3.axisBottom(x)) // This will create the X-axis
    // .selectAll("text")
    // .attr("transform", "translate(-10,0)rotate(-20)")
    // .style("text-anchor", "end");


    // Y axis
    var y = d3.scaleBand()
    .range([0, heightB])
    .domain(yearly.map(function(d) { return d.Year; }))
    .padding(.1);
    svgB.append("g").attr("class", "y-axis")
    .call(d3.axisLeft(y))

    // Bars
    // svgB.selectAll("myRect")
    // .data(yearly)
    // .enter()
    // .append("rect")
    // .attr("x", x(0))
    // .attr("y", function(d) { return y(d.Year); })
    // .attr("width", function(d) { return x(d.diff); })
    // .attr("height", y.bandwidth())
    // .attr("fill", "#ff5733");



    svgB.selectAll("myRect")
    .data(yearly)
    .enter()
    .append("rect")
    .attr("x", x(0))
    .attr("y", function(d) { return y(d.Year); })
    .attr("width", function(d) { return x(d.diff); })
    .attr("height", y.bandwidth())
    .attr("fill", "#ff5733")
    .on("mouseover", function(d) { // Show value on hover
        d3.select(this)
            .attr("fill", "orange"); // Change color on hover
        svgB.append("text")
            .attr("class", "bar-value")
            .attr("x", x(d.diff) + 5) // Position next to the bar
            .attr("y", y(d.Year) + y.bandwidth() / 2 + 4) // Adjust the vertical position
            .style("font-size", "12px")
            .text(d.total); // Display the value
    })
    .on("mouseout", function(d) { // Hide value on mouseout
        d3.select(this)
            .attr("fill", "#ff5733"); // Restore original color
        svgB.select(".bar-value").remove(); // Remove the value text
    });

    svgB.selectAll(".bar-label")
    .data(yearly)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", function(d) { return x(d.diff); }) // Position at the end of the bar
    .attr("y", function(d) { return y(d.Year) + y.bandwidth() / 2 + 4; }) // Adjust the vertical position
    .style("font-size", "10px") // Set the font size
    .text(function(d) { return (parseInt(d.total) / 1000000).toFixed(2) + "M"; }); // Convert to millions and add "M"



}