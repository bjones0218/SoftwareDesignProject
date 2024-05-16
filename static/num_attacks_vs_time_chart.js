const context = document.getElementById('attacks_vs_time_chart');

https://www.chartjs.org/docs/latest/getting-started/
new Chart(context, {type: 'bar',
                data: {labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                       datasets: [{label: '# of Votes',
                                   data: [12, 19, 3, 5, 2, 3],
                                   borderWidth: 1}]},
                options: {scales: {y: {beginAtZero: true}}}});