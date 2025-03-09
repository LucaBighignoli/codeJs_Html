document.addEventListener("DOMContentLoaded", () => {
    let trainingStats = JSON.parse(sessionStorage.getItem("trainingStats")) || {};

    if (Object.keys(trainingStats).length === 0) {
        document.body.innerHTML = "<h1>No training data available.</h1><button onclick='goBackToTraining()'>Back to Training</button>";
        return;
    }

    let categories = Object.keys(trainingStats);
    let correctAnswers = categories.map(cat => trainingStats[cat].correct);
    let incorrectAnswers = categories.map(cat => trainingStats[cat].total - trainingStats[cat].correct); // Total - Correct = Incorrect
    let avgTimes = categories.map(cat => (trainingStats[cat].total > 0 ? (trainingStats[cat].timeTaken / trainingStats[cat].total).toFixed(2) : 0));

    createBarChart(categories, correctAnswers, incorrectAnswers);
    createLineChart(categories, avgTimes);
});

// ✅ Function to create accuracy bar chart (Correct vs Incorrect)
function createBarChart(categories, correctAnswers, incorrectAnswers) {
    let ctx = document.getElementById("accuracyChart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: categories,
            datasets: [
                {
                    label: "Correct Answers",
                    data: correctAnswers,
                    backgroundColor: "green",
                },
                {
                    label: "Incorrect Answers",
                    data: incorrectAnswers,
                    backgroundColor: "red",
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// ✅ Function to create response time line chart
function createLineChart(categories, avgTimes) {
    let ctx = document.getElementById("timeChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: categories,
            datasets: [{
                label: "Average Response Time (s)",
                data: avgTimes,
                borderColor: "blue",
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// ✅ Function to go back to training
function goBackToTraining() {
    window.location.href = "trainingHome.html";
}