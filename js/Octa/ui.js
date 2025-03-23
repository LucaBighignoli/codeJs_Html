// ui.js - UI Updates and Feedback
document.title = improveMode ? "MathMind - Improve Mode" : "MathMind";


function displayFeedback(message, color) {
    const feedback = document.getElementById("feedback");
    feedback.innerText = message;
    feedback.style.color = color;

    const questionBox = document.getElementById("question");

    // ✅ Remove previous animation classes
    questionBox.classList.remove("correct-anim", "incorrect-anim");

    if (color === "green") {
        questionBox.classList.add("correct-anim"); // ✅ Add green flash
    } else if (color === "red") {
        questionBox.classList.add("incorrect-anim"); // ✅ Add red shake
    }

    // ✅ Remove animation after 0.6s
    setTimeout(() => {
        questionBox.classList.remove("correct-anim", "incorrect-anim");
    }, 600);
}

function updateUI() {
    const improveMode = sessionStorage.getItem("improveMode") === "true";

    // ✅ Dynamically update the tab title
    document.title = improveMode ? "MathMind - Improve Mode" : "MathMind";

    const scoreDisplay = document.getElementById("score");
    scoreDisplay.innerText = improveMode
        ? `Improve Score: ${improveScore}`
        : `Score: ${score}`;

    document.getElementById("level").innerText = `Level: ${getLevelName()}`;

    const livesDisplay = document.getElementById("lives");
    livesDisplay.innerHTML = "❤️".repeat(lives);
}


function endQuiz() {
    clearInterval(timerInterval);
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("final-score").style.display = "block";

    let improveMode = sessionStorage.getItem("improveMode") === "true";
    let currentLevel = getLevelName();
    let scoreMessage = `You answered ${score} questions correctly!`;
    let bestTimes = JSON.parse(localStorage.getItem("bestTimes")) || {};

    // ✅ Save timeLeft for the next session
    localStorage.setItem("currentTimeLeft", timeLeft);

    if (improveMode) {
        console.log(`Checking best time for ${currentLevel}: Current time left = ${timeLeft}`);
        if (!bestTimes[currentLevel] || timeLeft > bestTimes[currentLevel]) {
            bestTimes[currentLevel] = timeLeft;
            localStorage.setItem("bestTimes", JSON.stringify(bestTimes));
            scoreMessage = `🎉 Your New Record for ${currentLevel}: ${timeLeft} seconds! 🎉`;
        } else {
            scoreMessage = `Your time for ${currentLevel}: ${timeLeft} seconds`;
        }
    }

    document.getElementById("score-display").innerHTML = `
        ${scoreMessage} <br><br>
        <button onclick="restartQuiz()">Restart</button>
    `;
}

// Restart Improve Mode (same level)
function restartImprove() {
    let currentLevel = sessionStorage.getItem("currentLevel");
    console.log(`Restarting improvement for ${currentLevel}...`);
    window.location.href = "randomPlay.html";
}

// Go back to Improve Mode menu
function goBackToImprove() {
    console.log("Returning to Improve Mode menu...");
    window.location.href = "improvePlay.html"; // ✅ Keep Improve Mode active until Go Back is pressed
}
document.addEventListener("DOMContentLoaded", () => {
    const improveMode = sessionStorage.getItem("improveMode") === "true";
    document.title = improveMode ? "MathMind - Improve Mode" : "MathMind";
});

