// set the dimensions and margins of the graph
const margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 480 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#religious_area_chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
            `translate(${margin.left}, ${margin.top})`);

d3.csv("data/attacks_per_ideology/sub_religious_ideologies.csv").then(
    
    function(data) {
    
    // List of groups = header of the csv files
    const keys = data.columns.slice(1);

    // color palette
    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(["#fc8d59","#ef6548","#d7301f","#990000"]);
    //stack the data?
    const stackedData = d3.stack()
        .keys(keys)
        (data)

    /////////////
    // AXIS /////
    /////////////
    // Define the tick format function
    const formatYear = d3.format(".0f");

    // Add X axis
    const x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return +d.Year; }))
    .range([ 0, width ]);
    svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickValues([1970, 1980, 1990, 2000, 2010, 2020]).tickFormat(formatYear).tickSizeOuter(0));
        
    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height+ 40 )
        .text("Year");

        // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, 500])
    .range([ height, 0 ]);
    svg.append("g")
    .call(d3.axisLeft(y));

    
        // Add Y axis label
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", -100)
        .attr("y", -50)
        .text("number of attacks")
        .attr("text-anchor", "start")
        .attr("transform", "rotate(-90)")
        .attr("dy", "1em");

        // add a title
    svg.append("text")
        .attr("x", 25)
        .attr("y", -20)
        .attr("text-anchor", "left")
        .style("font-size", "18px")
        .text("Attacks by Religious Ideologies")
        .style("font-weight", "bold")
        .style("fill", "#990000");


    ////////////////////////
    // BRUSHING AND CHART //
    ////////////////////////

    // Add a clipPath: everything out of this area won't be drawn.
    const clip = svg.append("defs").append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", width )
    .attr("height", height )
    .attr("x", 0)
    .attr("y", 0);

    // Add brushing
    const brush = d3.brushX()                 // Add the brush feature using the d3.brush function
    .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the scatter variable: where both the circles and the brush take place
    const areaChart = svg.append('g')
    .attr("clip-path", "url(#clip)")

    // Area generator
    const area = d3.area()
    .x(function(d) { return x(d.data.Year); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); })

    // Show the areas
    areaChart
    .selectAll("mylayers")
    .data(stackedData)
    .join("path")
    .attr("class", function(d) { return "myArea " + d.key })
    .style("fill", function(d) { return color(d.key); })
    .attr("d", area)

    // Add the brushing
    areaChart
    .append("g")
    .attr("class", "brush")
    .call(brush);

    let idleTimeout
    function idled() { idleTimeout = null; }
    
    // A function that update the chart for given boundaries
    function updateChart(event,d) {
    
        extent = event.selection
    
        // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain(d3.extent(data, function(d) { return d.Year; }))
    }else{
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
        areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    }
    
        // Update axis and area position
    xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))
    svg
        .selectAll("path")
        .transition().duration(1000)
        .attr("d", area)
    }

    ////////////////////////////
    // HIGHLIGHT GROUP /////////
    ////////////////////////////

    // What to do when one group is hovered
    const highlight = function(event,d){
        // reduce opacity of all groups
        d3.selectAll(".myArea").style("opacity", .1)
        // expect the one that is hovered
        d3.select("."+d).style("opacity", 1)
        }
    
        // And when it is not hovered anymore
        const noHighlight = function(event,d){
        d3.selectAll(".myArea").style("opacity", 1)
        }
    
    
    
    //////////
    // LEGEND //
    //////////

    // Add one dot in the legend for each name.
    const size = 20
    svg.selectAll("myrect")
    .data(keys)
    .join("rect")
        .attr("x", 50)
        .attr("y", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color(d)})
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    // Add one dot in the legend for each name.
    svg.selectAll("mylabels")
    .data(keys)
    .join("text")
        .attr("x", 50 + size*1.2)
        .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    })

