function lineChart(data){
data = data.filter(d => d.Title !== "Total Methane (annual)" && d.Year !== "2012");
    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    var margin = { top: 10, right: 170, bottom: 30, left: 80 },
        width = 750 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#lineChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Parse the data and set up x and y scales
    data.forEach(function (d) {
        d.Year = new Date(d.Year); // Parse the date
        d.epa_change = +d.epa_change; // Convert to number
    });

    var x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.Year; }))
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return d.epa_change; })) // Adjust the domain
        .range([height, 0]);

    // Add X axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    svg.append("g")
        .call(d3.axisLeft(y));
    
    svg.append("text")
    .attr("x", width / 2)
    .attr("y", 3) // Adjust the vertical position as needed
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .text("Yearly Change in Emissions"); // Add your title text here


    // Create a group for each line and assign the color based on Title
    var groups = svg.selectAll(".line-group")
        .data(Array.from(d3.group(data, d => d.Title)).map(function (item) {
            return {
                Title: item[0],
                Values: item[1]
            };
        }))
        .enter()
        .append("g")
        .attr("class", "line-group");

    // Add the lines
    groups.append("path")
        .datum(function (d) { return d.Values; }) // Select data for each group
        .attr("fill", "none")
        .attr("stroke", function (d) { return colorScale(d[0].Title); }) // Color by Title
        .attr("stroke-width", 3)
        .attr("d", d3.line()
            .x(function (d) { return x(d.Year); })
            .y(function (d) { return y(d.epa_change); })
        );

    // Add legend
    var legend = svg.selectAll(".legend")
        .data(data.filter(function (item, index, self) {
            return self.findIndex(function (i) {
                return i.Title === item.Title;
            }) === index;
        }))
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (_, i) { return "translate(" + (width + 10) + "," + (i * 20) + ")"; });

    legend.append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", function (d) { return colorScale(d.Title); });

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function (d) { return d.Title.substring(6, d.Title.length - 9); });
    }