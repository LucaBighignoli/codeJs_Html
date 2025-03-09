document.addEventListener("DOMContentLoaded", initializePlayerStats);

function initializePlayerStats() {
    // ✅ Check if stats already exist in sessionStorage
    let playerStatTrain = JSON.parse(sessionStorage.getItem("overallTraining"));

    if (!playerStatTrain) {
        // ✅ If no stats exist, initialize new stats for this session
        playerStats = {
            stats: {
                Addition: { level: "Easy", correct: 0, total: 0 ,time: 0},
                Subtraction: { level: "Easy", correct: 0, total: 0 ,time: 0},
                Multiplication: { level: "Easy", correct: 0, total: 0 ,time: 0},
                Division: { level: "Easy", correct: 0, total: 0,time:0 }
            },
            gamesPlayed: 0
        };

        // ✅ Store stats in sessionStorage
        sessionStorage.setItem("overallTraining", JSON.stringify(playerStats));
        console.log("New session stats created:", playerStats);
    } else {
        console.log("Session stats loaded:", playerStatTrain);
    }
}

// ✅ Navigation functions
function goToPlay() {
    window.location.href = "quiz.html";
}

function goToTraining() {
    window.location.href = "trainingHome.html";
}

