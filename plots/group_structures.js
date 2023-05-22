// set the dimensions and margins of the graph
const margin = { top: 10, right: 150, bottom: 90, left: 60 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg_structures = d3.select("#group_structures")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("data/ideology_structure.csv").then(function (data) {

    // List of subgroups = header of the csv files
    const subgroups = data.columns.slice(1)

    // List of groups = value of the first column called group -> I show them on the X axis
    const groups = data.map(d => d.ideology)

    // Add X axis
    const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])
    svg_structures.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSize(0));

    // rotate x axis labels
    svg_structures.selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLog()
        .domain([0.001, 1])
        .range([height, 0]);

    // Another scale for subgroup position?
    const xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05])

    // color palette = one color per subgroup
    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"]);

    // Show the bars
    svg_structures.append("g")
        .selectAll("g")
        // Enter in data = loop group per group
        .data(data)
        .join("g")
            .attr("transform", d => `translate(${x(d.ideology)}, 0)`)
        .selectAll("rect")
        .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
        .join("rect")
            .attr("x", d => xSubgroup(d.key))
            .attr("y", d => y(d.value))
            .attr("width", xSubgroup.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("fill", d => color(d.key));
    

    // Show y axis ticks as 0.0001, 0.001, 0.01 etc. Do not show too many ticks.
    svg_structures.append("g")
        .call(d3.axisLeft(y)
            .tickValues([0.001, 0.01, 0.1, 1])
            // show values as decimal numbers (not scientific notation), but do not show too many digits. Hence 0.0001 is good, but not 1.000 (this should be 1)
            .tickFormat(d3.format(".4")));

    svg_structures.append("text")
        .attr("class", "y label")
        // size of text
        .attr("font-size", "14px")
        // color black
        .attr("fill", "black")
        .attr("text-anchor", "end")
        .attr("y", 6)
        // setting below shifts label to the left
        .attr("dy", "-3em")
        // shift label to the left
        .attr("transform", "rotate(-90)")
        .text("Proportion of groups with the indicated structure");

     legend = svg_structures.append("g")
        .attr("class", "legend")
        // put legend right from the graph
        .attr("transform", "translate(" + (width) + "," + 0 + ")")
        // color black
        .selectAll("g")
        .data(color.domain().slice().reverse())
        .enter().append("g")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        // color of the rectangles
        .attr("fill", color);

    legend.append("text")
        .attr("x", 25)
        .attr("y", 9)
        // color black
        .attr("fill", "black")
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function (d) { return d; });

})
