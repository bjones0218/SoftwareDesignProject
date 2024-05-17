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

async function create_chart() {
    var attacks = await get_attacks();

    var attack_counts = Array(years.length);
    attack_counts.fill(0);

    for (var i=0; i<attacks.features.length; i++) {
        var attack = attacks.features[i];
        var attack_year = parseInt(attack.properties.date.substring(0, 4));
        attack_counts[attack_year - START_YEAR] += 1;
    }

    const context = document.getElementById('attacks_vs_time_chart');
    https://www.chartjs.org/docs/latest/getting-started/
    new Chart(context, {type: 'line',
                    data: {labels: years,
                        datasets: [{label: 'Number of attacks',
                                    data: attack_counts,
                                    borderWidth: 1}]},
                    options: {scales: {y: {beginAtZero: true}},
                              fill: true}});
}

create_chart();

