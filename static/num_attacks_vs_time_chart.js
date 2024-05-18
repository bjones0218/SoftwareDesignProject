const START_YEAR = 1993;
const END_YEAR = 2020;

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

    const context = document.getElementById('attacks_vs_time_chart');
    var chart_label = region == "World" ? "Number of attacks" : "Number of attacks in " + region;
    https://www.chartjs.org/docs/latest/getting-started/
    new Chart(context, {type: 'line',
                    data: {labels: years,
                        datasets: [{label: chart_label,
                                    data: attack_counts,
                                    borderWidth: 1}]},
                    options: {scales: {y: {beginAtZero: true}},
                              fill: true}});
}

