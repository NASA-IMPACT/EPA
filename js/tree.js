function plotTree(data, state, year) {
  if (d3.select("#treeChart svg")) {
    d3.select("#treeChart svg").remove();
  }

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

    rectangles.each(function (d) {
      const minWidth = 50;
      const minHeight = 20;
      const maxFont = 50;
      const padding = 2;
    
      if (d.x1 - d.x0 > minWidth && d.y1 - d.y0 > minHeight) {
        const textWidth = d.x1 - d.x0;
        const textHeight = d.y1 - d.y0;
        const availableWidth = textWidth * (1 - padding / 100);
        const availableHeight = textHeight * (1 -padding / 100);
    
        const fontScale = d3.scaleLinear()
          .domain([minWidth, Math.min(width, height)])
          .range([20, maxFont]);
    
        const fontSize = fontScale(Math.min(availableWidth, availableHeight));
        const lineHeight = fontSize;
    
        const words = d.data.shortName.split(/\s+/);
        let line = '';
        const yStart = d.y0 + lineHeight * 0.5;
    
        const text = svg.append("text")
          .attr("class", "shortNameText")
          .attr("x", d.x0 + availableWidth * 0.02)
          .attr("y", yStart)
          .attr("font-size", fontSize)
          .attr("fill", "white");
    
        words.forEach(word => {
          const testLine = line ? `${line} ${word}` : word;
          const testLength = testLine.length * (fontSize / 2);
          if (testLength > availableWidth) {
            if (line) {
              text.append("tspan")
                .text(line + "...")
                .attr("x", d.x0 + availableWidth * 0.02)
                .attr("dy", lineHeight)
                .attr("y", yStart);
              return; // exit loop
            }
            line = ''; // Reset for the remaining words
          }
          if ((line + word).length * (fontSize / 2) <= availableWidth) {
            line = line ? `${line} ${word}` : word;
          }
        });
    
        if (line) {
          text.append("tspan")
            .text(line)
            .attr("x", d.x0 + availableWidth * 0.02)
            .attr("dy", lineHeight)
            .attr("y", yStart);
        }
    
        text.style("visibility", "visible");
      }
    });

    function showTooltip(event, d) {
      const percentage = ((d.data.value / d.parent.value) * 100).toFixed(2);
      const tooltipContent = `<b>Category:</b> ${d.parent.data.name}<br><b>Sub Category:</b> ${d.data.name}<br><b>Percentage:</b> ${percentage}%`;

      
      tooltip.html(tooltipContent)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 30) + "px")
        .style("visibility", "visible");
    
      d3.select(this).style("stroke-width", 3);
    }
    

  function hideTooltip() {
    tooltip.style("visibility", "hidden");
    d3.select(this).style("stroke-width", 1);
  }

  const tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "rgba(0, 0, 0, 0.7)")
    .style("color", "white")
    .style("padding", "15px")
    .style("border-radius", "5px")
    .style("visibility", "hidden")
    .style("font-size", "16px");

  svg
  .selectAll("titles")
  .data(root.descendants().filter(function (d) { return d.depth === 1; }))
  .enter()
  .append("text")
  .attr("x", function (d) { return d.x0; })
  .attr("y", function (d) { return d.y0 + 21; })
  .text(function (d) { return d.data.name; })
  .attr("font-size", function (d) {
    // Calculate font size based on rectangle dimensions
    const minWidth = 100;
    const minHeight = 50;
    if (d.x1 - d.x0 > minWidth && d.y1 - d.y0 > minHeight) {
      return "25px"; // Adjust font size as needed
    } else {
      return "0px"; // Hide labels if the rectangle is too small
    }
  })
  .attr("fill", "grey");

  svg
    .append("text")
    .attr("x", 0)
    .attr("y", 14)
    .text("TOTAL EMISSIONS - " + state + " State" + " - " + year)
    .attr("font-size", "25px")
    .attr("fill", "grey");
}
