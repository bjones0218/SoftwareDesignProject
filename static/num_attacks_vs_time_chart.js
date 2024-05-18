const START_YEAR = 1993;
const END_YEAR = 2020;
var attacks_vs_time_chart;

var years = [];
for (var i = START_YEAR; i <= END_YEAR; i++) {
    years.push(i);
}

async function get_attacks() {
    try {
        var attacks_response = await fetch('static/pirate_attacks.geojson');
        var attacks = await attacks_response.json();
        return attacks;
    } catch (error) {
        console.error("Failed to fetch attacks data:", error);
    }
}

async function get_region_of_all_country_codes() {
    try {
        var country_outlines_response = await fetch('static/country_outlines_with_indicators.geojson');
        var country_outlines = await country_outlines_response.json();
        var dictionary = {};
        for (var i = 0; i < country_outlines.features.length; i++) {
            var country = country_outlines.features[i].properties;
            dictionary[country.ISO_A3] = country.region;
        }
        return dictionary;
    } catch (error) {
        console.error("Failed to fetch country outlines data:", error);
    }
}

async function create_chart(region) {
    var attacks = await get_attacks();
    if (!attacks) return; // Prevent further execution if attacks data isn't available

    var country_codes_lookup;
    if (region !== "World") {
        country_codes_lookup = await get_region_of_all_country_codes();
        if (!country_codes_lookup) return; // Prevent further execution if lookup data isn't available
    }

    var attack_counts = Array(years.length).fill(0);

    for (var i = 0; i < attacks.features.length; i++) {
        var attack = attacks.features[i];
        var attack_year = parseInt(attack.properties.date.substring(0, 4));
        if (region === "World" || (country_codes_lookup[attack.properties.nearest_country] === region)) {
            attack_counts[attack_year - START_YEAR]++;
        }
    }

    const context = document.getElementById('attacks_vs_time_chart');
    var chart_label = region === "World" ? "Number of attacks worldwide" : "Number of attacks in " + region;

    if (attacks_vs_time_chart) {
        attacks_vs_time_chart.destroy();
    }
    
    attacks_vs_time_chart = new Chart(context, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: chart_label,
                data: attack_counts,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            fill: true,
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Attack Trends by Year'
                }
            }
        }
    });
}

window.onload = function() {
    create_chart("World");
};