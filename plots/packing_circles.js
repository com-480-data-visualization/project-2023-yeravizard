// set the dimensions and margins of the graph
const margin = {top: 300, right: 0, bottom: 0, left:500},
    width = 1500 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#packing")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left}, ${margin.top})`);

d3.json("data/major_goals.json").then(function(data) {
  //const color = d3.scaleOrdinal(d3.quantize(d3.interpolateHcl, data.children.length + 1));

  const multicolor = true;
  function setColorScheme(multi){
    if (multi) {
      let color = d3.scaleOrdinal()
        .range(["#5890b0", "#896894", "#f2dcaa", "#bf868e", "#699678", "#c9b5a0"])
      return color;
    }
  }
  
  let fontsize = d3.scaleOrdinal()
    .domain([1,3])
    .range([24,16])
  
  let color = setColorScheme(multicolor);

  function setCircleColor(obj) {
    let depth = obj.depth;
    while (obj.depth > 1) {
      obj = obj.parent;
    }
    let newcolor = multicolor ? d3.hsl(color(obj.data.name)) : d3.hsl(hexcolor);
    newcolor.l += depth == 0 ? 1 : depth * 0.05;
    return newcolor;
  }
  
  function setStrokeColor(obj) {
    let depth = obj.depth;
    while (obj.depth > 1) {
      obj = obj.parent;
    }
    let strokecolor = multicolor ? d3.hsl(color(obj.data.name)) : d3.hsl(hexcolor);
    return strokecolor;
  }

  const pack = data => d3.pack()
    .size([width - 2, height - 2])
    .padding(3)
    (d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value));
  
  const root = pack(data);
  let focus = root;
  let view;
  
  const node = svg.append("g")
    .selectAll("circle")
    .data(root.descendants().slice(1))
    .join("circle")
    .attr("fill", setCircleColor)
    .attr("stroke", setStrokeColor)
    .attr("pointer-events", d => !d.children ? "none" : null)
    .on("mouseover", function() { d3.select(this).attr("stroke", d => d.depth == 1 ? "black" : "white"); })
    .on("mouseout", function() { d3.select(this).attr("stroke", setStrokeColor); })
      .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));
  
  const label = svg.append("g")
    // make the text of the color of the circle but darker  
      //.style("font", "20px arial")
    .style("font-family", "Arial")
    .style("font-weight", "bold")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(root.descendants())
    .join("text")
    .style("fill", d => d3.hsl(setCircleColor(d)).darker())
    .style("font-size", d => `${fontsize(d.depth)}px`)
      .style("fill-opacity", d => d.parent === root ? 1 : 0)
      .style("display", d => d.parent === root ? "inline" : "none")
      .text(d => d.data.name);
  
      zoomTo([root.x, root.y, root.r * 2]);

      const resetButton = svg.append("g")
        .attr("class", "reset-button")
        .attr("transform", `translate(${0},${10})`)
        .on("click", () => {
          zoomTo([root.x, root.y, root.r * 2]);
          label
            .transition()
            .style("fill-opacity", d => d.parent === root ? 1 : 0)
            .style("display", d => d.parent === root ? "inline" : "none");
        });

      // Create a circle for the button
      resetButton.append("circle")
        .attr("r", 20)
        .style("fill", "blue")
        .style("cursor", "pointer");


      // Create text for the button
      resetButton.append("text")
        // put the button on the top left
        .attr("x", 0)
        .attr("y", 0)
        .style("fill", "white")
        .style("font-size", "14px")
        .style("text-anchor", "middle")
        .style("pointer-events", "none")
        .text("Reset");

      function zoomTo(v) {
        const k = width / v[2];

        view = v;

        label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node
          .attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`)
          .attr("r", d => d.r * k);
      }

      function zoom(event, d) {
      
        const focus = d;
      
        const transition = svg.transition()
          .duration(event.altKey ? 7500 : 750)
          .tween("zoom", d => {
            if (d === root) { // Check if the clicked circle is the outer circle
              zoomTo([root.x, root.y, root.r * 2]); // Reset the zoom level to the initial state
              return;
            }
            const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
            return t => zoomTo(i(t));
          });
      
        label
          .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
          .transition(transition)
          .style("fill-opacity", d => d.parent === focus ? 1 : 0)
          .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
          .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
      }
      
});
