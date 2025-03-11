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

    // ✅ Ensure Improve Mode is turned off for normal play
    localStorage.setItem("improveMode", "false");
    localStorage.removeItem("currentLevel");

    generateNewQuestions();
    document.getElementById("ready-container").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    inQuiz = true;
    resetGame();
    startBufferTime();
    setTimeout(() => loadRandomQuiz(getLevelName()), 2000);
}

// Check the answer
function submitAnswer() {
    const answerInput = document.getElementById("answer-input").value.trim();
    if (answerInput === "") return;

    const userAnswer = parseInt(answerInput);
    if (isNaN(userAnswer)) {
        displayFeedback("Please enter a valid number.", "orange");
        return;
    }

    if (userAnswer === currentCorrectAnswer) {
        score++;
        displayFeedback("✅ Correct!", "green");
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
    updateUI();
    setTimeout(() => loadRandomQuiz(getLevelName()), 1000);
}

// Show Congratulations and options
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
// Improve level (replay a past level)
function nextLevel() {
    console.log(`Current level: ${level} -> Moving to next level...`);

    sessionStorage.setItem("improveMode", "false");  // ✅ Disable Improve Mode
    sessionStorage.removeItem("currentLevel");

    if (level < levelNames.length) {
        level++;  // ✅ Increase level

        // ✅ Use `localStorage` to permanently save reached levels
        let reachedLevels = JSON.parse(localStorage.getItem("reachedLevels")) || ["Iron"];
        if (!reachedLevels.includes(getLevelName())) {
            reachedLevels.push(getLevelName());
            localStorage.setItem("reachedLevels", JSON.stringify(reachedLevels));  // ✅ Store reached levels
        }
    } else {
        console.log("You've reached the max level!");
        return;
    }

    timerEnabled = false;
    clearInterval(timerInterval);

    document.getElementById("final-score").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";

    updateUI();
    loadRandomQuiz(getLevelName());
}




// Restart the quiz
function restartQuiz() {
    resetGame();
    document.getElementById("final-score").style.display = "none";
    document.getElementById("ready-container").style.display = "block";
}

// Improve level (replay last completed level)
function improveLevel() {
    console.log("Improving last completed level...");

    const currentLevelName = getLevelName();  // ✅ Get the correct level name
    if (!currentLevelName) {
        console.error("Error: Unable to determine last completed level!");
        return;
    }

    console.log(`Storing currentLevel: ${currentLevelName}`);

    sessionStorage.setItem("improveMode", "true");  // ✅ Store Improve Mode in sessionStorage
    sessionStorage.setItem("currentLevel", currentLevelName);  // ✅ Store last completed level

    window.location.href = "improvePlay.html";  // ✅ Redirect to Improve Play
}

