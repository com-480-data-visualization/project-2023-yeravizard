// set the dimensions and margins of the graph
const margin_recruitment = { top: 60, right: 130, bottom: 100, left: 60 },
    width_recr = 900 - margin_recruitment.left - margin_recruitment.right,
    height_recr = 600 - margin_recruitment.top - margin_recruitment.bottom;

// append the svg object to the body of the page
const svg_recruitment = d3.select("#recruitment_strategies")
    .append("svg")
    .attr("width", width_recr + margin_recruitment.left + margin_recruitment.right)
    .attr("height", height_recr + margin_recruitment.top + margin_recruitment.bottom)
    .append("g")
    .attr("transform", `translate(${margin_recruitment.left},${margin_recruitment.top})`);

// Parse the Data
d3.csv("data/ideology_recruitment.csv").then(function (data) {

    // List of subgroups = header of the csv files
    const subgroups = data.columns.slice(1)

    // List of groups = value of the first column called group -> I show them on the X axis
    const groups = data.map(d => d.ideology)

    // Add X axis
    const x = d3.scaleBand()
        .domain(groups)
        .range([0, width_recr])
        .padding([0.2])
    svg_recruitment.append("g")
        .attr("transform", `translate(0, ${height_recr})`)
        .call(d3.axisBottom(x).tickSize(0));

    // rotate x axis labels
    svg_recruitment.selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLog()
        .domain([0.001, 1])
        .range([height_recr, 0]);

    // Another scale for subgroup position?
    const xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05])

    // color palette = one color per subgroup
    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(["#0571b0", "#7b3294", "#F2C14E", "#BF2237", "#1a9641"]);

    // Show the bars
    svg_recruitment.append("g")
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
            .attr("height", d => height_recr - y(d.value))
            .attr("fill", d => color(d.key));

    // Show y axis ticks as 0.0001, 0.001, 0.01 etc. Do not show too many ticks.
    svg_recruitment.append("g")
        .call(d3.axisLeft(y)
            .tickValues([0.001, 0.01, 0.1, 1])
            // show values as decimal numbers (not scientific notation), but do not show too many digits. Hence 0.0001 is good, but not 1.000 (this should be 1)
            .tickFormat(d3.format(".4")));

    svg_recruitment.append("text")
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

     legend = svg_recruitment.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width_recr) + "," + 0 + ")")
        //
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
});

