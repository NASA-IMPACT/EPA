var marginL = { top: 10, right: 170, bottom: 30, left: 80 },
widthL = 750 - marginL.left - marginL.right,
heightL = 400 - marginL.top - marginL.bottom;

// append the svg object to the body of the page
var svgL = d3.select("#lineChart")
.append("svg")
.attr("width", widthL + marginL.left + marginL.right)
.attr("height", heightL + marginL.top + marginL.bottom)
.append("g")
.attr("transform",
    "translate(" + marginL.left + "," + marginL.top + ")");

function lineChart(data, state, title) {
    svgL.selectAll("*").remove();

    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Parse the data and set up x and y scales
    data = data.filter(d =>  d.Year !== "2012");
    data.forEach(function (d) {
        d.Year = new Date(d.Year); // Parse the date
        d.epa_change = +d.epa_change; // Convert to number
    });

    var x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.Year; }))
        .range([0, widthL]);

    var y = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return d.epa_change; })) // Adjust the domain
        .range([heightL, 0]);

    // Add X axis
    svgL.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + heightL + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    svgL.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    svgL.append("text")
        .attr("class", "line-title")
        .attr("x", widthL / 2)
        .attr("y", 3) // Adjust the vertical position as needed
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Yearly Change in Emissions " + state); // Add your title text here

    // Create a group for each line and assign the color based on Title
    var groups = svgL.selectAll(".line-group")
        .data(Array.from(d3.group(data, d => d.Title)).map(function (item) {
            return {
                Title: item[0],
                Values: item[1]
            };
        }))
        .enter()
        .append("g")
        .attr("class", "line-group");

    // Add the lines with animation along their paths
    groups.each(function (d) {
        var group = d3.select(this);

        group.append("path")
            .datum(d.Values)
            .attr("fill", "none")
            .attr("stroke", colorScale(d.Title))
            .attr("stroke-width", 3)
            .attr("d", d3.line()
                .x(function (d) { return x(d.Year); })
                .y(function (d) { return y(d.epa_change); })
            )
            .attr("stroke-dasharray", function (d) {
                var totalLength = this.getTotalLength();
                return totalLength + " " + totalLength;
            })
            .attr("stroke-dashoffset", function (d) {
                var totalLength = this.getTotalLength();
                return totalLength;
            })
            .transition()
            .duration(6000)
            .attr("stroke-dashoffset", 0);
    });

        // Add legend
        var legend = svgL.selectAll(".legend")
        .data(data.filter(function (item, index, self) {
            return self.findIndex(function (i) {
                return i.Title === item.Title;
            }) === index;
        }))
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (_, i) { return "translate(" + (widthL + 10) + "," + (i * 20) + ")"; });

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
