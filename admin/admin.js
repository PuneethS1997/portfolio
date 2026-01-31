// Fetch data from localStorage
const demoStats = JSON.parse(localStorage.getItem("demoStats")) || {};
const dailyViews = JSON.parse(localStorage.getItem("dailyViews")) || {};

// Total portfolio views
const totalViews = Object.values(dailyViews).reduce((a, b) => a + b, 0);
document.getElementById("totalViews").innerText = totalViews;

// Total demo opens
const totalDemos = Object.values(demoStats).reduce((a, b) => a + b, 0);
document.getElementById("totalDemos").innerText = totalDemos;

// Most viewed demo
const topDemo = Object.entries(demoStats).sort((a, b) => b[1] - a[1])[0];
document.getElementById("topDemo").innerText = topDemo ? topDemo[0] : "—";

// Reset analytics
function resetStats() {
    if (confirm("Reset all analytics?")) {
        localStorage.removeItem("demoStats");
        localStorage.removeItem("dailyViews");
        location.reload();
    }
}

// Logout admin
function adminLogout() {
    localStorage.removeItem("isAdmin");
    window.location.href = "/index.html";
}
// 📈 Daily Views Chart
new Chart(document.getElementById("viewsChart"), {
    type: "line",
    data: {
        labels: Object.keys(dailyViews),
        datasets: [{
            label: "Views",
            data: Object.values(dailyViews),
            tension: 0.4,
            borderWidth: 2,
            fill: true
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// 🔥 Demo Popularity Chart
new Chart(document.getElementById("demoChart"), {
    type: "bar",
    data: {
        labels: Object.keys(demoStats),
        datasets: [{
            label: "Demo Opens",
            data: Object.values(demoStats),
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});