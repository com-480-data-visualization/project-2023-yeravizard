// 1. Create an SVG container for the map
const svg_group_attacks = d3.select('#group_map').append('svg')
    .attr('width', 800)
    .attr('height', 600);

// 2. Define the map projection
const projection = d3.geoMercator()
    .center([0, 0])
    .translate([400, 300])
    .scale(100);

// 3. Load your dataset
d3.json('data/group_attack_coordinates.json', function (error, data) {
    if (error) throw error;
    // 4. Convert your coordinates into the format required by the map projection
    const geoData = data.map(d => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [d.lon, d.lat],
        },
        properties: {
            group: d.group,
        },
    }));

    console.log('GeoData:', geoData);

    // 5. Create a path generator that will create the path elements for your map
    const path = d3.geoPath()
        .projection(projection);

    // 6. Bind your data to path elements and append them to the SVG container
    svg_group_attacks.selectAll('.point')
        .data(geoData)
        .enter()
        .append('path')
        .attr('class', 'point')
        .attr('d', path);

    // 7. Style the path elements according to the terrorist group
    svg_group_attacks.selectAll('.point')
        .style('fill', d => {
            switch (d.properties.group) {
                case 'Tehrik-i-Taliban Pakistan (TTP)':
                    return 'red';
                case 'Irish Republican Army (IRA)':
                    return 'green';
                case 'Mujahedin-e Khalq (MEK)':
                    return 'blue';
                default:
                    return 'gray';
            }
        })
        .style('opacity', 0.5);

    // 8. Add interactivity to the map using D3's event listeners
    svg_group_attacks.selectAll('.point')
        .on('mouseover', function (d) {
            d3.select(this).style('stroke', 'black');
        })
        .on('mouseout', function (d) {
            d3.select(this).style('stroke', 'none');
        });
});