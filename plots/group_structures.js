// Set the dimensions and margins of the graph
const margin_groupstruct = { top: 60, right: 110, bottom: 100, left: 60 },
  width_groupstruct = 800 - margin_groupstruct.left - margin_groupstruct.right,
  height_groupstruct = 600 - margin_groupstruct.top - margin_groupstruct.bottom;

// Append the svg object to the body of the page
const svg_structures = d3
  .select("#group_structures")
  .append("svg")
  .attr("width", width_groupstruct + margin_groupstruct.left + margin_groupstruct.right)
  .attr("height", height_groupstruct + margin_groupstruct.top + margin_groupstruct.bottom)
  .append("g")
  .attr("transform", `translate(${margin_groupstruct.left},${margin_groupstruct.top})`);

// Parse the Data
d3.csv("data/ideology_structure.csv").then(function (data) {
  // List of subgroups = header of the csv files
  const subgroups = data.columns.slice(1);

  // List of groups = value of the first column called group -> I show them on the X axis
  const groups = data.map(d => d.ideology);

  // Add X axis
  const x = d3
    .scaleBand()
    .domain(groups)
    .range([0, width_groupstruct])
    .padding([0.2]);
  svg_structures
    .append("g")
    .attr("transform", `translate(0, ${height_groupstruct})`)
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  const y = d3.scaleLog().domain([0.001, 1]).range([height_groupstruct, 0]);

  // Another scale for subgroup position?
  const xSubgroup = d3
    .scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05]);

  // Color palette = one color per subgroup
  const color = d3
    .scaleOrdinal()
    .domain(subgroups)
    .range(["#0571b0", "#7b3294", "#F2C14E", "#BF2237", "#1a9641"]);

  // Show the bars
  const bars = svg_structures
    .append("g")
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", d => `translate(${x(d.ideology)}, 0)`)
    .selectAll("rect")
    .data(function (d) {
      return subgroups.map(function (key) {
        return { key: key, value: d[key] };
      });
    })
    .join("rect")
    .attr("x", d => xSubgroup(d.key))
    .attr("y", d => y(d.value) + 0.0000001)
    .attr("width", xSubgroup.bandwidth())
    .attr("height", d => height_groupstruct - y(d.value) + 0.000001)
    .attr("fill", d => color(d.key))

  // Add Y axis ticks
  svg_structures
    .append("g")
    .call(
      d3
        .axisLeft(y)
        .tickValues([0.001, 0.01, 0.1, 1])
        .tickFormat(d3.format(".4"))
    );

  // Add Y axis label
  svg_structures
    .append("text")
    .attr("class", "y label")
    .attr("font-size", "14px")
    .attr("fill", "black")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", "-3em")
    .attr("transform", "rotate(-90)")
    .text("Proportion of groups with the indicated structure");

  // Add legend
  const legend = svg_structures
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width_groupstruct}, ${0})`)
    .selectAll("g")
    .data(color.domain().slice().reverse())
    .join("g")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legend
    .append("rect")
    .attr("x", 0)
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", color);

  legend
    .append("text")
    .attr("x", 25)
    .attr("y", 9)
    .attr("fill", "black")
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(d => d);
    });