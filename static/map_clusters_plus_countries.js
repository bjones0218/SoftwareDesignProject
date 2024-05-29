// this file displays the map and adds points and polygons to it to represent pirate attacks and countries
// it uses the maplibre library: https://maplibre.org/maplibre-gl-js/docs/
// code adapted from https://maplibre.org/maplibre-gl-js/docs/examples/cluster/

// create a map using the maplibre library and place it in the map div
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/streets/style.json?key=D7IRYVVxzUM00mJgVi72',
    center: [52.50724258398793, 4.582651487193887],
    zoom: 3
});


map.on('load', () => {

    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    
    // source data from GeoJSON
    map.addSource('pirate_attacks', {type: 'geojson',
                                     // Point to GeoJSON data
                                     data: 'static/pirate_attacks.geojson',
                                     cluster: true,
                                     clusterMaxZoom: 14, // Max zoom to cluster points on
                                     clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
                                    });

    map.addSource('countries', {type: "geojson",
                                data: "static/country_outlines_with_indicators.geojson"})

    // defining the layers that are shown on the map:
    // big circles for point clusters
    map.addLayer({id: 'clusters',
                  type: 'circle',
                  source: 'pirate_attacks',
                  filter: ['has', 'point_count'],
                  paint: {// Use step expressions (https://maplibre.org/maplibre-style-spec/#expressions-step)
                          // with three steps to implement three types of circles:
                          //   * Blue, 20px circles when point count is less than 100
                          //   * Yellow, 30px circles when point count is between 100 and 750
                          //   * Pink, 40px circles when point count is greater than or equal to 750
                          'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
                          'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]}});

    // text on top of each cluster to display how many attacks are included in it
    map.addLayer({id: 'cluster-count',
                  type: 'symbol',
                  source: 'pirate_attacks',
                  filter: ['has', 'point_count'],
                  layout: {'text-field': '{point_count_abbreviated}',
                           'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                           'text-size': 12}});

    // points representing individual attacks
    map.addLayer({id: 'unclustered-point',
                  type: 'circle',
                  source: 'pirate_attacks',
                  filter: ['!', ['has', 'point_count']],
                  paint: {'circle-color': '#11b4da',
                          'circle-radius': 10,
                          'circle-stroke-width': 2,
                          'circle-stroke-color': '#fff'}});
    
    // country outlines
    // https://maplibre.org/maplibre-gl-js/docs/examples/geojson-polygon/
    map.addLayer({'id': 'countries',
                  'type': 'fill',
                  'source': 'countries',
                  'layout': {},
                  'paint': {'fill-color': 'rgba(0, 0, 0, 0.0)', 'fill-opacity': 0.6}})
    
    // inspect a cluster on click
    map.on('click', 'clusters', async (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        const zoom = await map.getSource('pirate_attacks').getClusterExpansionZoom(clusterId);
        map.easeTo({
            center: features[0].geometry.coordinates,
            zoom
        });
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        var date_iso = e.features[0].properties.date;
        var date_string = new Date(date_iso).toDateString();
        // dispay either the attack description, if it is available, or the date
        var details_popup = e.features[0].properties.attack_description == "NA" ? date_string : e.features[0].properties.attack_description;
        var font_size = e.features[0].properties.attack_description == "NA" ? 16 : 12;
        
        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new maplibregl.Popup()
            .setLngLat(coordinates)
            .setHTML(`<p style="font-size: ${font_size}px;">${details_popup}</p>`)
            .addTo(map);

    });

    // give visual indication that the points can be clicked on
    map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
    });

    map.on('mouseenter', 'unclustered-point', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'unclustered-point', () => {
        map.getCanvas().style.cursor = '';
    });

    // adapted from https://maplibre.org/maplibre-gl-js/docs/examples/polygon-popup-on-click/
    // When a click event occurs on a feature in the countries layer, open a popup at the
    // location of the click, with description HTML from its properties.
    map.on('click', 'countries', (e) => {
        var indicators = JSON.parse(e.features[0].properties.indicators);
        const STARTING_YEAR = 1993;
        var gdp2019 = indicators[2019 - STARTING_YEAR].gdp;
        if (gdp2019 === null || gdp2019 === undefined) {
            gdp2019 = "No data";
        }
        // time series starts at 1993, ends at 2019
        new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(e.features[0].properties.ADMIN + "'s 2019 GDP per capita: " + gdp2019)
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the countries layer.
    map.on('mouseenter', 'countries', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'countries', () => {
        map.getCanvas().style.cursor = '';
    });

});