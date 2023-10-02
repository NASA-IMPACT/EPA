function barChart(yearly){
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 30, bottom: 40, left: 90},
    width =600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#barChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    var minTotalEmissions = d3.min(yearly, d => d.TotalEmissions);
    var yearly = yearly.map(function(d) {
        return {
            Year: d.Year,
            TotalEmissions: d.TotalEmissions,
            diff: d.TotalEmissions - minTotalEmissions + 100000000
        };
    });

    var maxTotalEmissions = d3.max(yearly, d => d.diff);
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0) // Adjust the vertical position as needed
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Yearly Total Emissions"); // Add your title text here

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, maxTotalEmissions])
        .range([0, width]);
    svg.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(x))
    //     .selectAll("text")
    //     .attr("transform", "translate(-10,0)rotate(-45)")
    //     .style("text-anchor", "end");

    // Y axis
    var y = d3.scaleBand()
    .range([0, height])
    .domain(yearly.map(function(d) { return d.Year; }))
    .padding(.1);
    svg.append("g")
    .call(d3.axisLeft(y))

    // Bars
    svg.selectAll("myRect")
    .data(yearly)
    .enter()
    .append("rect")
    .attr("x", x(0))
    .attr("y", function(d) { return y(d.Year); })
    .attr("width", function(d) { return x(d.diff); })
    .attr("height", y.bandwidth())
    .attr("fill", "#ff5733");

    svg.selectAll(".bar-label")
    .data(yearly)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", function(d) { return x(d.diff) + 5; }) // Adjust the position as needed
    .attr("y", function(d) { return y(d.Year) + y.bandwidth() / 2; }) // Adjust the position as needed
    .style("font-size", "10px") // Set the font size
    .text(function(d) { return (d.TotalEmissions / 1000000000).toFixed(2) + "M"; }); // Convert to millions and add "M"

}