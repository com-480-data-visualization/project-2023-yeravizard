// set the dimensions and margins of the graph
const drawTimeRel = () => {
const margin = {top: 10, right: 30, bottom: 30, left: 60};
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#religious_time")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

    
d3.csv("../data/REL.csv").then((data) => {
        const parseTime = d3.timeParse("%Y");
        const subgroups = data.columns.slice(1);
        const years = data.map((d) => parseTime(d.iyear.toString()));
        const maxVal = d3.max(data, (d) => d3.sum(subgroups, (key) => +d[key]));

        const tickValues = years.filter(d => d.getFullYear() % 5 === 0);

        // Set the ticks for the x-axis to the array of tick values
        var x = d3.scaleBand()
            .domain(years)
            .range([0, width])
            .padding(0.2);
        

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickValues(tickValues).tickFormat(d3.timeFormat("%Y")))
            .selectAll(".tick text")
            .attr("transform", "translate(10,0)");

        // Add Y axis
        var y = d3.scaleLinear().domain([0, maxVal]).range([height, 0]);
        svg.append("g").call(d3.axisLeft(y));

        var stackedData = d3.stack().keys(subgroups)(data);
        var stackedKeys = stackedData.map(d => d.key);

        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(stackedKeys)
            .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999', '#66c2a5']);

        //stack the data? --> stack per subgroup
        var stackedData = d3.stack().keys(subgroups)(data);

        // perform a barplot for each subgroup of the stack
        svg.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .join("g")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data((d) => d)
            .join("rect")
            .attr("x", (d) => x(parseTime(d.data.iyear.toString())))
            .attr("y", (d) => y(d[1]))
            .attr("height", (d) => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())


        // add a legend
        svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")

        svg.selectAll("mydots")
            .data(subgroups)
            .join("circle")
            .attr("cx", 500)
            .attr("cy", (_,i) => 100 + i*25) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", (d) => color(d))

            // Add one dot in the legend for each name.
            svg.selectAll("mylabels")
                .data(subgroups)
                .join("text")
                .attr("x", 515)
                .attr("y", (d,i) => 101 + i*25) // 100 is where the first dot appears. 25 is the distance between dots
                // Add some space between the dot and the name
                .text((d) => '' + d)
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .attr("fill", (d) => color(d));
        
        })

}

export default drawTimeRel;