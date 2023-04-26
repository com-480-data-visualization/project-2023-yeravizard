// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg_ideologies = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/ethno_nationalist.csv", 
    function(d) {
        return { year : d.iyear, 
            ethno_nationalist : d.ethno_nationalist, 
            religious : d.religious, 
            extreme_left: d.extreme_left, 
            extreme_right: d.extreme_right,  
            other: d.single_issue};
        },
  
    function(data) {
        
        var keys = ["ethno nationalists", "religious", "extreme left", "extreme right", "other"]

        var color = d3.scaleOrdinal()
            .domain(keys)
            .range(d3.schemeSet2);

        // add the options to the button
        d3.select("#selectButton")
        .selectAll('myOptions')
        .data(data)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button

        // Add X axis --> it is a date format
        var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.year; }))
        .range([ 0, width ]);
        svg_ideologies.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // Add Y axis log scale
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return + d.religious; })])
            .range([ height, 0 ]);
        svg_ideologies.append("g")
        .call(d3.axisLeft(y));

        // Add the line
        svg_ideologies.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", function(d){ return color('ethno nationalists')})                                                              
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.year) })
            .y(function(d) { return y(d.ethno_nationalist) })
            )
        // Add the line
        svg_ideologies.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", function(d){ return color('religious')})
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.year) })
            .y(function(d) { return y(d.religious) })
            )
        // Add the line
        svg_ideologies.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", function(d){ return color('extreme left')})
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.year) })
            .y(function(d) { return y(d.extreme_left) })
            )
        // Add the line
        svg_ideologies.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", function(d){ return color('extreme right')})
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.year) })
            .y(function(d) { return y(d.extreme_right) })
            )
        
        svg_ideologies.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", function(d){ return color('other')})
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.year) })
            .y(function(d) { return y(d.other) })
            )
        // ad a title
        svg_ideologies.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")

        svg_ideologies.selectAll("mydots")
            .data(keys)
            .enter()
            .append("circle")
                .attr("cx", 250)
                .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("r", 7)
                .style("fill", function(d){ return color(d)})

            // Add one dot in the legend for each name.
        svg_ideologies.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
                .attr("x", 270)
                .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", function(d){ return color(d)})
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")

})


