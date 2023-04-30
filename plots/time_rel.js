// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#religious_time")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/REL.csv", 
        function(data) {

        var subgroups = data.columns.slice(1);
        var year = d3.map(data, function(d){return(d.iyear)}).keys();

        // Add X axis

        var x = d3.scaleBand()
        .domain(year)
        .range([0, width])
        .padding([0.2])
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 200])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999', '#66c2a5']);

        //stack the data? --> stack per subgroup
        var stackedData = d3.stack()
            .keys(subgroups)
            (data)

        // perform a barplot for each subgroup of the stack
        svg.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
            .attr("fill", function(d) { return color(d.key); })
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(function(d) { return d; })
            .enter().append("rect")
                .attr("x", function(d) { return x(d.data.iyear); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width",x.bandwidth())

        // add a legend
        svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")

        svg.selectAll("mydots")
            .data(keys)
            .enter()
            .append("circle")
                .attr("cx", 200)
                .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("r", 7)
                .style("fill", function(d){ return color(d.key)})

            // Add one dot in the legend for each name.
            svg.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
                .attr("x", 200)
                .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", function(d){ return color(d.key)})
                .text(function(d){ return d.key})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")

        
        })