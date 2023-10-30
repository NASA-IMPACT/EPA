d3.json("data/tree_map_data1.json").then(function (data) {
  const margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 2000 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

  const svg = d3.select("#treeChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      `translate(${margin.left}, ${margin.top})`);

  const root = d3.hierarchy(data).sum(function (d) { return d.value });

  d3.treemap()
    .size([width, height])
    .paddingTop(28)
    .paddingRight(7)
    .paddingInner(3)
    (root);

  // Define a custom color scheme for categories
  const colorScheme = d3.scaleOrdinal()
    .domain(root.children.map(d => d.data.name))
    .range(["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f", "#edc949"]);

  const opacity = d3.scaleLinear()
    .domain([10, 30])
    .range([0.5, 1]);

  // Append rectangles with tooltips
const rectangles = svg
  .selectAll("rect")
  .data(root.leaves())
  .join("rect")
  .attr('x', function (d) { return d.x0; })
  .attr('y', function (d) { return d.y0; })
  .attr('width', function (d) { return d.x1 - d.x0; })
  .attr('height', function (d) { return d.y1 - d.y0; })
  .style("stroke", "black")
  .style("fill", function (d) { return colorScheme(d.parent.data.name); })
  .style("opacity", function (d) { return opacity(d.data.value); })
  .on("mouseover", showTooltip) // Show tooltip on hover
  .on("mouseout", hideTooltip); // Hide tooltip on mouseout;


  // Append shortName text inside rectangles for large enough rectangles
  rectangles.each(function (d) {
    const minWidth = 100; // Minimum width for displaying shortName
    const minHeight = 50; // Minimum height for displaying shortName

    if (d.x1 - d.x0 > minWidth && d.y1 - d.y0 > minHeight) {
      d3.select(this.parentNode)
        .append("text")
        .attr("class", "shortNameText")
        .attr("x", function () { return d.x0 +10; }) // Center the text horizontally
        .attr("y", function () { return d.y0 +70; }) // Center the text vertically
        .text(function () { return d.data.shortName; }) // Display shortName
        .attr("font-size", function () { return d.data.value/10000000; }) // Adjust font size as needed
        .attr("fill", "white");
    }
  });



  function showTooltip(event, d) {
    const percentage = ((d.data.value / d.parent.value) * 100).toFixed(2);
    const tooltipContent = `${d.data.name}\n${percentage}%`;
    tooltip.html(tooltipContent)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 30) + "px")
      .style("visibility", "visible");
      
    d3.select(this).style("stroke-width", 3); // Highlight the rectangle
  }
  
  function hideTooltip() {
    tooltip.style("visibility", "hidden");
    d3.select(this).style("stroke-width", 1); // Remove the highlight
  }

  // Create a custom tooltip
  const tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("background", "rgba(0, 0, 0, 0.7)")
  .style("color", "white")
  .style("padding", "15px") // Increase padding
  .style("border-radius", "5px")
  .style("visibility", "hidden")
  .style("font-size", "16px"); // Increase font size

  // Add titles and main label
  svg
    .selectAll("titles")
    .data(root.descendants().filter(function (d) { return d.depth === 1; }))
    .enter()
    .append("text")
    .attr("x", function (d) { return d.x0; })
    .attr("y", function (d) { return d.y0 + 21; })
    .text(function (d) { return d.data.name; })
    .attr("font-size", "30px")
    .attr("fill", "grey");

  svg
    .append("text")
    .attr("x", 0)
    .attr("y", 14)
    .text("TOTAL EMISSIONS")
    .attr("font-size", "25px")
    .attr("fill", "grey");
});



// d3.json("data/tree_map_data.json").then(function(data) {
//     const width = 800;
//     const height = 800;

//     const svg = d3.select("#treeChart")
//       .append("svg")
//       .attr("width", width)
//       .attr("height", height);

//     const treemap = data => d3.treemap()
//       .size([width, height])
//       .padding(2)
//       (d3.hierarchy(data)
//         .sum(d => d.value)
//         .sort((a, b) => b.value - a.value));

//     const root = treemap(data);

//     const color = d3.scaleOrdinal(d3.schemeCategory10);

//     const cell = svg
//       .selectAll("g")
//       .data(root.leaves())
//       .enter()
//       .append("g")
//       .attr("transform", d => `translate(${d.x0},${d.y0})`);

//     // Calculate the total value for each category
//     const categoryTotalValues = new Map();

//     root.leaves().forEach(d => {
//         const categoryName = d.parent.data.name;
//         if (!categoryTotalValues.has(categoryName)) {
//             categoryTotalValues.set(categoryName, 0);
//         }
//         categoryTotalValues.set(categoryName, categoryTotalValues.get(categoryName) + d.data.value);
//     });

//     // Calculate percentages for each leaf
//     root.leaves().forEach(d => {
//         const categoryName = d.parent.data.name;
//         const categoryTotalValue = categoryTotalValues.get(categoryName);
//         d.data.percentage = (d.data.value / categoryTotalValue) * 100;
//     });

//     cell
//       .append("rect")
//       .attr("id", d => (d.leafUid = "leaf").id)
//       .attr("class", "tile")
//       .attr("width", d => d.x1 - d.x0)
//       .attr("height", d => d.y1 - d.y0)
//       .attr("fill", d => color(d.parent.data.name));

//     cell
//       .append("text")
//       .attr("x", 3)
//       .attr("y", 15)
//       .text(d => d.data.name)
//       .style("font-size", "14px")
//       .style("fill", "white");

//     // Update text labels to display percentages
//     cell
//       .append("text")
//       .attr("x", 3)
//       .attr("y", 30)
//       .text(d => d.data.percentage.toFixed(2) + "%")
//       .style("font-size", "14px")
//       .style("fill", "white");

//     // Create a separate legend SVG
//     const legendSvg = d3.select("#legend")
//       .append("svg")
//       .attr("width", 200) // Adjust the width as needed
//       .attr("height", 200); // Adjust the height as needed

//     const legend = legendSvg
//       .selectAll(".legend")
//       .data(root.children.map(d => d.data.name))
//       .enter()
//       .append("g")
//       .attr("class", "legend")
//       .attr("transform", (d, i) => `translate(10, ${i * 15 })`);

//     legend
//       .append("rect")
//       .attr("width", 12)
//       .attr("height", 12)
//       .attr("fill", d => color(d));

//     legend
//       .append("text")
//       .attr("x", 20)
//       .attr("y", 6)
//       .attr("dy", "0.5em")
//       .style("font-size", "14px")
//       .style("fill", "black")
//       .text(d => d);
//   });
// // d3.json("data/tree_map_data.json").then(function(data) {



// //           // Create a legend with the correct colors
// //     const legend = svg
// //     .selectAll(".legend")
// //     .data(root.children.map(d => d.data.name))
// //     .enter()
// //     .append("g")
// //     .attr("class", "legend")
// //     .attr("transform", (d, i) => `translate(10, ${i * 15 })`);

// //   legend
// //     .append("rect")
// //     .attr("width", 12)
// //     .attr("height", 12)
// //     .attr("fill", d => color(d));

// //   legend
// //     .append("text")
// //     .attr("x", 20)
// //     .attr("y", 6)
// //     .attr("dy", "0.5em")
// //     .style("font-size", "14px")
// //     .style("fill", "black")
// //     .text(d => d);
// // });



//   d3.json("data/tree_map_data.json").then(function(data) {
//     const width = 800;
//     const height = 800;

//     const svg = d3.select("#circles")
//       .append("svg")
//       .attr("width", width)
//       .attr("height", height);

//     const pack = data => d3.pack()
//       .size([width, height])
//       .padding(2)
//       (d3.hierarchy(data)
//         .sum(d => d.value)
//         .sort((a, b) => b.value - a.value));

//     const root = pack(data);

//     const color = d3.scaleOrdinal(d3.schemeCategory10);

//     const node = svg.selectAll("g")
//       .data(root.descendants())
//       .enter().append("g")
//       .attr("transform", d => `translate(${d.x},${d.y})`);

//     node.append("circle")
//       .attr("r", d => d.r)
//       .attr("fill", d => color(d.data.name));

//     node.append("text")
//       .attr("dy", "0.3em")
//       .style("text-anchor", "middle")
//       .text(d => d.data.name);
//   });

