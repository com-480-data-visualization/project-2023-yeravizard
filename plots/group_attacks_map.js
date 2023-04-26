// 1. Import D3
import * as d3 from 'd3';

// 2. Create an SVG container for the map
const svg = d3.select('#group_map').append('svg')
    .attr('width', 800)
    .attr('height', 600);

// 3. Define the map projection
const projection = d3.geoMercator()
    .center([0, 0])
    .translate([400, 300])
    .scale(100);

// 4. Load your dataset
d3.json('data/group_attack_coordinates.json').then(data => {
    // 5. Convert your coordinates into the format required by the map projection
    const geoData = data.map(d => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [d.long, d.lat],
        },
        properties: {
            group: d.group,
        },
    }));

    // 6. Create a path generator that will create the path elements for your map
    const path = d3.geoPath()
        .projection(projection);

    // 7. Bind your data to path elements and append them to the SVG container
    svg.selectAll('.point')
        .data(geoData)
        .enter()
        .append('path')
        .attr('class', 'point')
        .attr('d', path);

    // 8. Style the path elements according to the terrorist group
    svg.selectAll('.point')
        .style('fill', d => {
            switch (d.properties.group) {
                case 'A':
                    return 'red';
                case 'B':
                    return 'green';
                case 'C':
                    return 'blue';
                // ... more cases
                default:
                    return 'gray';
            }
        })
        .style('opacity', 0.5);

    // 9. Add interactivity to the map using D3's event listeners
    svg.selectAll('.point')
        .on('mouseover', function (d) {
            d3.select(this).style('stroke', 'black');
        })
        .on('mouseout', function (d) {
            d3.select(this).style('stroke', 'none');
        });
});