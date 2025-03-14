// main.js - Main Game Logic

const levelNames = ["Iron", "Bronze", "Silver", "Gold", "Diamond"];

let score = 0;
let lives = 3;
let level = 1;
let bestScore = 0;
let inQuiz = false;
let timerEnabled = true;

// Ensure Improve Mode is only enabled when explicitly set
const improveMode = localStorage.getItem("improveMode") === "true";
if (!improveMode) {
    localStorage.setItem("improveMode", "false");  // ✅ Force Normal Mode by default
    localStorage.removeItem("currentLevel");  // ✅ Remove stored Improve Mode level
} else {
    level = levelNames.indexOf(localStorage.getItem("currentLevel")) + 1 || 1;
}

// Reset game state
function resetGame() {
    timeLeft = 90;
    score = 0;
    lives = 3;
    timerEnabled = !improveMode;
    updateUI();
}

// Get current level name
function getLevelName() {
    console.log(`Fetching level name for level ${level}...`);
    return levelNames[level - 1] || "Unknown";
}

// Start the quiz
function startQuiz() {
    console.log("Starting quiz...");

    let improveMode = sessionStorage.getItem("improveMode") === "true";

    if (improveMode) {
        console.log("🚀 Improve Mode ACTIVE: Playing improvement for", sessionStorage.getItem("currentLevel"));
    } else {
        // ✅ Load last saved level or default to Iron
        let savedLevel = localStorage.getItem("currentLevel");
        if (savedLevel && levelNames.includes(savedLevel)) {
            level = levelNames.indexOf(savedLevel) + 1;
        } else {
            level = 1; // Default to Iron
        }
        console.log("🎮 Normal Play Mode: Resuming from level:", getLevelName());
    }

    // ✅ Load saved score & time
    score = parseInt(localStorage.getItem("currentScore")) || 0;
    timeLeft = parseInt(localStorage.getItem("currentTimeLeft")) || 90;

    localStorage.setItem("currentLevel", getLevelName()); // ✅ Save level persistently

    generateNewQuestions();
    document.getElementById("ready-container").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    inQuiz = true;
    updateUI();
    startBufferTime();
    setTimeout(() => loadRandomQuiz(getLevelName()), 2000);
}
// Check the answer
function submitAnswer() {
    const answerInput = document.getElementById("answer-input");
    const userAnswer = parseInt(answerInput.value.trim());

    if (answerInput.value.trim() === "") return;

    if (isNaN(userAnswer)) {
        displayFeedback("Please enter a valid number.", "orange");
    } else if (userAnswer === currentCorrectAnswer) {
        score++;
        displayFeedback("✅ Correct!", "green");

        // ✅ Save score in localStorage
        localStorage.setItem("currentScore", score);

        if (score % 5 === 0 && !improveMode) {
            showCongratulations();
            return;
        }
    } else {
        lives--;
        displayFeedback(`❌ Incorrect. The correct answer was ${currentCorrectAnswer}.`, "red");
        if (lives <= 0) {
            endQuiz();
            return;
        }
    }

    answerInput.value = ""; // ✅ Clear input field
    updateUI();
    setTimeout(() => loadRandomQuiz(getLevelName()), 1000);
}

// Show Congratulations and options
function showCongratulations() {
    console.log("Level Up!");
    clearInterval(timerInterval);
    timerEnabled = false;

    const nextLevelName = getLevelName();

    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("final-score").style.display = "block";
    document.getElementById("score-display").innerHTML = `
        🎉 Congratulations! You reached ${nextLevelName} level!<br><br>
        <button onclick="improveLevel()">Improve</button>
        <button onclick="nextLevel()">Next Level</button>
    `;
}


// Improve level (replay current level)
function nextLevel() {
    console.log(`Current level: ${level} -> Moving to next level...`);

    sessionStorage.setItem("improveMode", "false");
    sessionStorage.removeItem("currentLevel");

    if (level < levelNames.length) {
        level++;
        localStorage.setItem("currentLevel", getLevelName());  // ✅ Save last reached level

        lives = 3;
        timeLeft = 90;

        let reachedLevels = JSON.parse(localStorage.getItem("reachedLevels")) || ["Iron"];
        if (!reachedLevels.includes(getLevelName())) {
            reachedLevels.push(getLevelName());
            localStorage.setItem("reachedLevels", JSON.stringify(reachedLevels));
        }
    } else {
        console.log("You've reached the max level!");
        return;
    }

    timerEnabled = true;
    clearInterval(timerInterval);
    startTimer();

    document.getElementById("final-score").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";

    updateUI();
    loadRandomQuiz(getLevelName());
}
function improveLevel() {
    console.log("Improving last completed level..."); // ✅ Fix: Use console.log

    const currentLevelName = getLevelName();
    if (!currentLevelName) {
        console.error("❌ Error: Unable to determine last completed level!");
        return;
    }

    console.log(`Storing currentLevel: ${currentLevelName}`);

    // ✅ Store Improve Mode settings
    sessionStorage.setItem("improveMode", "true");
    sessionStorage.setItem("currentLevel", currentLevelName);

    console.log("🚀 Improve Mode is now set to:", sessionStorage.getItem("improveMode"));
    window.location.href = "improvePlay.html";  // ✅ Redirect to Improve Play
}

function goBack() {
    console.log("⬅️ Go Back button pressed...");

    // ✅ If the quiz is active, restart it instead of leaving
    if (document.getElementById("quiz-container").style.display === "block") {
        restartQuiz();  // ✅ Calls restartQuiz() to avoid repeated code
    } else {
        console.log("🏠 Returning to main menu...");
        window.location.href = "Home.html";  // ✅ Default behavior for menus
    }
}
function restartQuiz() {
    console.log("🔄 Restarting quiz without resetting progress...");

    clearInterval(timerInterval); // ✅ Stop the timer immediately
    inQuiz = false;  // ✅ Mark the game as not active

    // ✅ Keep the current level & score unchanged
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("ready-container").style.display = "block";
    document.getElementById("score").innerText = `Score: ${score}`; // ✅ Preserve score display

    console.log(`➡️ Ready to start again from level: ${getLevelName()}, Score: ${score}`);
}
document.addEventListener("DOMContentLoaded", function() {
    let savedLevel = localStorage.getItem("currentLevel");
    if (savedLevel && levelNames.includes(savedLevel)) {
        level = levelNames.indexOf(savedLevel) + 1;
    } else {
        level = 1; // Default to Iron
    }

    score = parseInt(localStorage.getItem("currentScore")) || 0;
    timeLeft = parseInt(localStorage.getItem("currentTimeLeft")) || 90;

    console.log(`🔄 Loaded saved progress: Level ${getLevelName()}, Score: ${score}, Time Left: ${timeLeft} sec`);
    updateUI();
});





