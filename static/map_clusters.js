// This adds clusters of pirate attacks with the number of attacks based on how zoomed in you are and their proximity with one another.
// allows you to click to zoom as well until you click a lone attack, then shows details about it. (attack description)
const map = new maplibregl.Map({

    container: 'map',

    style: 'https://api.maptiler.com/maps/streets/style.json?key=D7IRYVVxzUM00mJgVi72',

    center: [4.582651487193887, 52.50724258398793],

    zoom: 3

});


map.on('load', () => {

    // Add a new source from our GeoJSON data and

    // set the 'cluster' option to true. GL-JS will

    // add the point_count property to your source data.

    console.log("map onload called");
    map.addSource('pirate_attacks', {

        type: 'geojson',

        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes

        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.

        data: 'static/pirate_attacks.geojson',

        cluster: true,

        clusterMaxZoom: 14, // Max zoom to cluster points on

        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)

    });



    map.addLayer({

        id: 'clusters',

        type: 'circle',

        source: 'pirate_attacks',

        filter: ['has', 'point_count'],

        paint: {

            // Use step expressions (https://maplibre.org/maplibre-style-spec/#expressions-step)

            // with three steps to implement three types of circles:

            //   * Blue, 20px circles when point count is less than 100

            //   * Yellow, 30px circles when point count is between 100 and 750

            //   * Pink, 40px circles when point count is greater than or equal to 750

            'circle-color': [

                'step',

                ['get', 'point_count'],

                '#51bbd6',

                100,

                '#f1f075',

                750,

                '#f28cb1'

            ],

            'circle-radius': [

                'step',

                ['get', 'point_count'],

                20,

                100,

                30,

                750,

                40

            ]

        }

    });



    map.addLayer({

        id: 'cluster-count',

        type: 'symbol',

        source: 'pirate_attacks',

        filter: ['has', 'point_count'],

        layout: {

            'text-field': '{point_count_abbreviated}',

            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],

            'text-size': 12

        }

    });



    map.addLayer({

        id: 'unclustered-point',

        type: 'circle',

        source: 'pirate_attacks',

        filter: ['!', ['has', 'point_count']],

        paint: {

            'circle-color': '#11b4da',

            'circle-radius': 4,

            'circle-stroke-width': 1,

            'circle-stroke-color': '#fff'

        }

    });



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

        let attack_description;

        if (e.features[0].properties.attack_description =="NA")
        {
            console.log("No desc");
            attack_description = "No Description Provided";
        }
        else
        {
            console.log("Decription present");
            attack_description = e.features[0].properties.attack_description;	
        }
        




        // Ensure that if the map is zoomed out such that

        // multiple copies of the feature are visible, the

        // popup appears over the copy being pointed to.

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {

            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;

        }



        new maplibregl.Popup()

            .setLngLat(coordinates)

            .setHTML(

                `attack_description: ${attack_description}`

            )

            .addTo(map);

    });



    map.on('mouseenter', 'clusters', () => {

        map.getCanvas().style.cursor = 'pointer';

    });

    map.on('mouseleave', 'clusters', () => {

        map.getCanvas().style.cursor = '';

    });

});
