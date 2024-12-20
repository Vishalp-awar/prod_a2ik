
// let trafficChart, sourcesChart;

// async function fetchAnalytics() {
//     try {
//         const response = await fetch('http://localhost:3000/analytics');
//         const data = await response.json();
//         updateDashboard(data);
//     } catch (error) {
//         console.error('Error fetching analytics:', error);
//     }
// }

// function updateDashboard(data) {
//     document.getElementById('totalVisits').textContent = data.totalVisits.toLocaleString();
//     document.getElementById('uniqueVisitors').textContent = data.uniqueVisitors.toLocaleString();
//     document.getElementById('pageViews').textContent = data.pageViews.toLocaleString();
//     document.getElementById('bounceRate').textContent = data.bounceRate + '%';

//     updateTrafficChart(data.trafficOverTime);
//     updateSourcesChart(data.trafficSources);
//     updateTopPagesTable(data.topPages);
// }

// function updateTrafficChart(trafficData) {
//     const ctx = document.getElementById('trafficChart').getContext('2d');
//     if (trafficChart) {
//         trafficChart.destroy();
//     }
//     trafficChart = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: trafficData.map(item => item.month),
//             datasets: [{
//                 label: 'Visits',
//                 data: trafficData.map(item => item.count),
//                 borderColor: '#3b82f6',
//                 backgroundColor: 'rgba(59, 130, 246, 0.1)',
//                 tension: 0.4,
//                 fill: true
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: {
//                 legend: {
//                     display: false
//                 }
//             },
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                     grid: {
//                         display: false
//                     }
//                 },
//                 x: {
//                     grid: {
//                         display: false
//                     }
//                 }
//             }
//         }
//     });
// }

// function updateSourcesChart(sourcesData) {
//     const ctx = document.getElementById('sourcesChart').getContext('2d');
//     if (sourcesChart) {
//         sourcesChart.destroy();
//     }
//     sourcesChart = new Chart(ctx, {
//         type: 'doughnut',
//         data: {
//             labels: sourcesData.map(item => item._id),
//             datasets: [{
//                 data: sourcesData.map(item => item.count),
//                 backgroundColor: [
//                     '#3b82f6',
//                     '#10b981',
//                     '#f59e0b',
//                     '#ef4444'
//                 ]
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: {
//                 legend: {
//                     position: 'bottom'
//                 }
//             }
//         }
//     });
// }

// function updateTopPagesTable(topPages) {
//     const tbody = document.querySelector('#topPages tbody');
//     tbody.innerHTML = '';
//     topPages.forEach(page => {
//         const row = tbody.insertRow();
//         row.insertCell(0).textContent = page._id;
//         row.insertCell(1).textContent = page.views.toLocaleString();
//         row.insertCell(2).textContent = page.avgTime + 's';
//     });
// }

// fetchAnalytics();
// setInterval(fetchAnalytics, 60000); // Refresh every minute

let trafficChart, sourcesChart;

function showLoading() {
    document.querySelectorAll('.metric-value').forEach(el => {
        el.textContent = 'Loading...';
    });
    document.querySelectorAll('.chart-container').forEach(el => {
        el.innerHTML = '<p>Loading chart...</p>';
    });
    document.querySelector('#topPages tbody').innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
}

async function fetchAnalytics() {
    showLoading();
    try {
        console.log('Fetching analytics data...');
        const response = await fetch("http://localhost:3000/analytics");
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Received data:', data);
        updateDashboard(data);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        document.getElementById('text').innerHTML += `<p class="error">Error: ${error.message}</p>`;
        document.querySelectorAll('.metric-value').forEach(el => {
            el.textContent = 'Error';
        });
        document.querySelectorAll('.chart-container').forEach(el => {
            el.innerHTML = '<p>Failed to load chart</p>';
        });
        document.querySelector('#topPages tbody').innerHTML = '<tr><td colspan="3">Failed to load data</td></tr>';
    }
}

function updateDashboard(data) {
    document.getElementById('totalVisits').textContent = data.totalVisits.toLocaleString();
    document.getElementById('uniqueVisitors').textContent = data.uniqueVisitors.toLocaleString();
    document.getElementById('pageViews').textContent = data.pageViews.toLocaleString();
    document.getElementById('bounceRate').textContent = data.bounceRate + '%';

    updateTrafficChart(data.trafficOverTime);
    updateSourcesChart(data.trafficSources);
    updateTopPagesTable(data.topPages);
}

function updateTrafficChart(trafficData) {
    const ctx = document.getElementById('trafficChart').getContext('2d');
    if (trafficChart) {
        trafficChart.destroy();
    }
    trafficChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: trafficData.map(item => item.month),
            datasets: [{
                label: 'Visits',
                data: trafficData.map(item => item.count),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function updateSourcesChart(sourcesData) {
    const ctx = document.getElementById('sourcesChart').getContext('2d');
    if (sourcesChart) {
        sourcesChart.destroy();
    }
    sourcesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: sourcesData.map(item => item._id),
            datasets: [{
                data: sourcesData.map(item => item.count),
                backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateTopPagesTable(topPages) {
    const tbody = document.querySelector('#topPages tbody');
    tbody.innerHTML = '';
    topPages.forEach(page => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = page._id;
        row.insertCell(1).textContent = page.views.toLocaleString();
        row.insertCell(2).textContent = page.avgTime + 's';
    });
}

// Call fetchAnalytics immediately and then every 60 seconds
fetchAnalytics();
setInterval(fetchAnalytics, 60000);

