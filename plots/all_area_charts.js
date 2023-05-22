

// set the dimensions and margins of the graph
const margin = { top: 60, right: 230, bottom: 50, left: 50 },
  width = 800 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;


let chartKeys;
let chartData = [];
let areaChart;
let area;

// append the svg object to the body of the page
const svg = d3
  .select("#area_chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

areaChart = svg.append("g").attr("clip-path", "url(#clip)");

// Load the data for all charts
Promise.all([
  d3.csv("data/attacks_per_ideology/dominant_ideologies.csv"),
  d3.csv("data/attacks_per_ideology/sub_ethnonat_ideologies.csv"),
  d3.csv("data/attacks_per_ideology/sub_left_ideologies.csv"),
  d3.csv("data/attacks_per_ideology/sub_religious_ideologies.csv"),
  d3.csv("data/attacks_per_ideology/sub_right_ideologies.csv"),
  d3.csv("data/attacks_per_ideology/sub_single_ideologies.csv"),
]).then(function (data) {
  const dominantIdeologiesData = data[0];
  const subEthnonatIdeologiesData = data[1];
  const subLeftIdeologiesData = data[2];
  const subReligiousIdeologiesData = data[3];
  const subRightIdeologiesData = data[4];
  const subSingleIdeologiesData = data[5];

  // List of groups = header of the csv files
  const keys = dominantIdeologiesData.columns.slice(1);

  // color palette
  const color = d3
    .scaleOrdinal()
    .domain(keys)
    .range(["#76B7B2", "#E15759", "#F28E2B", "#EDC948", "#B07AA1"]); // choose the colors from a d3 palette

  // stack the data for each chart
  const stackedData = [
    d3.stack().keys(keys)(dominantIdeologiesData),
    d3.stack().keys(keys)(subEthnonatIdeologiesData),
    d3.stack().keys(keys)(subLeftIdeologiesData),
    d3.stack().keys(keys)(subReligiousIdeologiesData),
    d3.stack().keys(keys)(subRightIdeologiesData),
    d3.stack().keys(keys)(subSingleIdeologiesData),
  ];

  // Show the initial area chart
  showAreaChart(0);

  // Function to show the area chart for a specific index
    function showAreaChart(index) {
        // Update data and chart
        chartData = stackedData[index];
        chartKeys = keys.slice(); // Create a copy of keys to avoid modification
        //const chartKeys = keys.slice(); // Create a copy of keys to avoid modification
    
        // Update domains
        x.domain(d3.extent(dominantIdeologiesData, function (d) {return +d.Year;}));
        y.domain([0, d3.max(chartData[chartData.length - 1], function (d) {
        return d[1];
        })]);
    
        // Update X axis
        xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5));
    
        // Update areas
        const areas = areaChart
        .selectAll(".myArea")
        .data(chartData, function (d) {return d.key;});
    
        areas
        .enter()
        .append("path")
        .attr("class", function (d) {return "myArea " + d.key;})
        .style("fill", function (d) {return color(d.key);})
        .merge(areas)
        .transition()
        .duration(1000)
        .attr("d", area);
    
        areas.exit().remove();
    }

  /////////////
  // AXIS /////
  /////////////

  // Add X axis
  const x = d3
    .scaleLinear()
    .domain(d3.extent(dominantIdeologiesData, function (d) {return +d.Year;}))
    .range([0, width]);
  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")).tickSizeOuter(0));

  // Add X axis label:
  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 90)
    .text("Time (year)")
    .style("font-family", "Helvetica")
    .style("font-weight", "bold")
    .style("font-size", "14px")

    .attr("fill", "#000")
    .attr("transform", `translate(-${margin.right}, -${margin.bottom})`);

  // Add Y axis
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(chartData[chartData.length - 1], function (d) {return d[1];})])
    .nice() // Add .nice() to ensure nice and round values for the Y axis
    .range([height, 0]);

    // Create the scatter variable: where both the areas and the brush take place
    areaChart = svg.append("g").attr("clip-path", "url(#clip)");

    // Add Y axis label:
    svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", 0)
    .attr("y", -20)
    .text("Number of attacks")
    .attr("text-anchor", "start")
    .style("font-family", "Helvetica")
    .style("font-weight", "bold")
    .style("font-size", "14px")
    .attr("fill", "#000");

  ////////////////////////
  // BRUSHING AND CHART //
  ////////////////////////

  // Add a clipPath: everything out of this area won't be drawn.
  const clip = svg
    .append("defs")
    .append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0);

  // Add brushing
  const brush = d3
    .brushX()
    .extent([
      [0, 0],
      [width, height],
    ])
    .on("end", updateChart);

  // Area generator
  area = d3
    .area()
    .curve(d3.curveLinear)
    .x(function (d) {return x(d.data.Year);})
    .y0(function (d) {return y(d[0]);})
    .y1(function (d) {return y(d[1]);});


  // Function to update the chart based on brush selection
  function updateChart(event, d) {
    const extent = event.selection;

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
      x.domain(d3.extent(dominantIdeologiesData, function (d) {return d.Year;}));
    } else {
      x.domain([x.invert(extent[0]), x.invert(extent[1])]);
      areaChart.select(".brush").call(brush.move, null); // This removes the grey brush area as soon as the selection has been done
    }

    // Update axis and areas
    xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5));
    areaChart
      .selectAll("path")
      .transition()
      .duration(1000)
      .attr("d", area);
  }

  // Function to handle idle timeout
  function idled() {idleTimeout = null;}

  // Function to handle hover highlight
  function highlight(event, d) {
    // Reduce opacity of all areas
    d3.selectAll(".myArea").style("opacity", 0.1);
    // Except the one that is hovered
    d3.select("." + d).style("opacity", 1);
  }

  // Function to handle mouseleave no highlight
  function noHighlight(event, d) {
    d3.selectAll(".myArea").style("opacity", 1);
  }
});

  // Helper function to process the CSV data
function processData(data) {
    // Convert strings to numbers
    data.forEach(function (d) {
        for (let key in d) {
        if (key !== "Year") {
            d[key] = +d[key];
        }
        }
    });
    return data;
    }

// Function to handle idle timeout
let idleTimeout;
function idled() {
  idleTimeout = null;
}

// Function to handle hover highlight
function highlight(event, d) {
  // Reduce opacity of all areas
  d3.selectAll(".myArea").style("opacity", 0.1);
  // Except the one that is hovered
  d3.select("." + d).style("opacity", 1);
}

// Function to handle mouseleave no highlight
function noHighlight(event, d) {
  d3.selectAll(".myArea").style("opacity", 1);
}

// Function to process the CSV data
function processData(data) {
  // Convert strings to numbers
  data.forEach(function (d) {
    for (let key in d) {
      if (key !== "Year") {
        d[key] = +d[key];
      }
    }
  });
  return data;
}


// Helper function to process the CSV data
function processData(data) {
    // Convert strings to numbers
    data.forEach(function (d) {
      for (let key in d) {
        if (key !== "Year") {
          d[key] = +d[key];
        }
      }
    });
    return data;
  }
  
  // Load the data for sub-ideologies
  d3.csv("data/attacks_per_ideology/sub_ethnonat_ideologies.csv").then(function (data) {
    // Process the data for sub-ideologies
    const subEthnonatIdeologiesData = processData(data);

    // Bind the data to the stacked area chart
    const stackedSubEthnonatData = d3.stack().keys(chartKeys)(subEthnonatIdeologiesData);

    // Append the stacked areas for sub-ideologies
    areaChart
    .selectAll(".subArea")
    .data(stackedSubEthnonatData)
    .enter()
    .append("path")
    .attr("class", function (d) {
        return "subArea " + d.key;
    })
    .style("fill", function (d) {
        return color(d.key);
    })
    .attr("d", area);
  });
  
  // Load the data for sub-ideologies
  
d3.csv("data/attacks_per_ideology/sub_left_ideologies.csv").then(function (data) {
    // Process the data
    const subLeftIdeologiesData = processData(data);
  
    // Bind the data to the stacked area chart
    const stackedSubLeftData = d3.stack().keys(chartKeys)(subLeftIdeologiesData);
  
    // Append the stacked areas for sub-left-ideologies
    areaChart
      .selectAll(".subArea")
      .data(stackedSubLeftData)
      .enter()
      .append("path")
      .attr("class", function (d) {
        return "subArea " + d.key;
      })
      .style("fill", function (d) {
        return color(d.key);
      })
      .attr("d", area);
  });
  
  // Load the data for sub-ideologies
  d3.csv("data/attacks_per_ideology/sub_religious_ideologies.csv").then(function (data) {
    // Process the data
    const subReligiousIdeologiesData = processData(data);
  
    // Bind the data to the stacked area chart
    const stackedSubReligiousData = d3.stack().keys(chartKeys)(subReligiousIdeologiesData);
  
    // Append the stacked areas for sub-religious-ideologies
    areaChart
      .selectAll(".subArea")
      .data(stackedSubReligiousData)
      .enter()
      .append("path")
      .attr("class", function (d) {
        return "subArea " + d.key;
      })
      .style("fill", function (d) {
        return color(d.key);
      })
      .attr("d", area);
  });
  
  // Load the data for sub-ideologies
  d3.csv("data/attacks_per_ideology/sub_right_ideologies.csv").then(function (data) {
    // Process the data
    const subRightIdeologiesData = processData(data);
  
    // Bind the data to the stacked area chart
    const stackedSubRightData = d3.stack().keys(chartKeys)(subRightIdeologiesData);
  
    // Append the stacked areas for sub-right-ideologies
    areaChart
      .selectAll(".subArea")
      .data(stackedSubRightData)
      .enter()
      .append("path")
      .attr("class", function (d) {
        return "subArea " + d.key;
      })
      .style("fill", function (d) {
        return color(d.key);
      })
      .attr("d", area);
  });
  
  // Load the data for sub-single-ideologies
    d3.csv("data/attacks_per_ideology/sub_single_ideologies.csv").then(function (data) {
    // Process the data
    const subSingleIdeologiesData = processData(data);
  
    // Bind the data to the stacked area chart
    const stackedSubSingleData = d3.stack().keys(chartKeys)(subSingleIdeologiesData);
  
    // Append the stacked areas for sub-single-ideologies
    areaChart
      .selectAll(".subArea")
      .data(stackedSubSingleData)
      .enter()
      .append("path")
      .attr("class", function (d) {
        return "subArea " + d.key;
      })
      .style("fill", function (d) {
        return color(d.key);
      })
      .attr("d", area);
  });

// Function to show the text box based on the section
function showTextBox(textBoxId) {
    $(textBoxId).css("opacity", "1");
}

// Function to hide the text box based on the section
function hideTextBox(textBoxId) {
    $(textBoxId).css("opacity", "0");
}

// Function to update the sub-ideology chart based on the section
function updateSubIdeologyChart(sectionId) {
    const subIdeology = sectionId.replace("#", "");
    const chartData = [
        // Data for the stacked area chart for the sub-ideology
    ];
    drawChart(chartData);
}

// Function to hide the sub-ideology chart based on the section
function hideSubIdeologyChart(sectionId) {
    $(sectionId).css("opacity", "0");
}
function drawChart(data) {
    // Clear previous chart if any
    svg.selectAll("*").remove();

    // Rest of the code to create the stacked area chart using the provided data
    // ...

    // Append the stacked areas
    areaChart
        .selectAll(".myArea")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("class", function (d) {
            return "myArea " + d.key;
        }
        .style("fill", function (d) {
            return color(d.key);
        }
        .attr("d", area);

    // Append the X axis
    svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
        
    }
