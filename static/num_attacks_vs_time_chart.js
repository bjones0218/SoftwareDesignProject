const START_YEAR = 1993;
const END_YEAR = 2020;
var attacks_vs_time_chart;


var years = [];
for (var i=START_YEAR; i<=END_YEAR; i++) {
    years.push(i);
}

async function get_attacks() {
    var attacks_response = await fetch('static/pirate_attacks.geojson');
    var attacks = await attacks_response.json();
    
    return attacks;
}

async function get_region_of_all_country_codes() {
    var country_outlines_response = await fetch('static/country_outlines_with_indicators.geojson');
    var country_outlines = await country_outlines_response.json();
    var dictionary = {};
    for (var i=0; i<country_outlines.features.length; i++) {
        var country = country_outlines.features[i].properties;
        dictionary[country.ISO_A3] = country.region;
    }
    return dictionary;
}

/* possible regions are:
East Asia & Pacific
Europe & Central Asia
Latin America & Caribbean
Middle East & North Africa
North America
South Asia
Sub-Saharan Africa
World
*/
async function create_chart(region) {
    var attacks = await get_attacks();

    var country_codes_lookup;
    if (region != "World") {
        country_codes_lookup = await get_region_of_all_country_codes();
    }

    var attack_counts = Array(years.length);
    attack_counts.fill(0);

    for (var i=0; i<attacks.features.length; i++) {
        var attack = attacks.features[i];
        var attack_year = parseInt(attack.properties.date.substring(0, 4));
        if (region == "World") {
            attack_counts[attack_year - START_YEAR] += 1;
        } else {
            var attack_country_code = attack.properties.nearest_country;
            var attack_region = country_codes_lookup[attack_country_code];
            if (attack_region == region) {
                attack_counts[attack_year - START_YEAR] += 1;
            }
        }
    }

    //designing color
    const ctx = document.getElementById("attacks_vs_time_chart").getContext('2d');
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(58,123,213,1)");
    gradient.addColorStop(1, "rgba(0,210,255,0.3)");

    const context = document.getElementById('attacks_vs_time_chart');
    var chart_label = region == "World" ? "Number of attacks" : "Number of attacks in " + region;
    https://www.chartjs.org/docs/latest/getting-started/
    attacks_vs_time_chart = new Chart(context, {type: 'line',
                    data: {labels: years,
                        datasets: [{label: chart_label,
                                    data: attack_counts,
                                    borderWidth: 1}]},
                    options: {scales: {y: {beginAtZero: true}},
                              fill: true,
                              responsive: true,
                              backgroungColor: gradient,
                            }});
}

// this unction is to destroy the old chart and create new chart when drow down list element change
function updateChart() {
    if (attacks_vs_time_chart) {
        attacks_vs_time_chart.destroy(); // Destroy the old chart to draw a new one
    }
    create_chart(document.getElementById('chartSelector').value);
}