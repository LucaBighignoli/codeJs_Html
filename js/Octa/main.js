// main.js - Main Game Logic

let score = 0;
let lives = 3;
let level = 1;
let bestScore = 0;
let inQuiz = false;
let timerEnabled = true;

// Level names mapping (must match octajson.json)
const levelNames = ["Iron", "Bronze", "Silver", "Gold", "Diamond"];

// Reset game state
function resetGame() {
    timeLeft = 90;       // Reset timer to 90 seconds
    score = 0;           // Reset score
    lives = 3;           // Reset lives
    level = 1;           // Reset level
    timerEnabled = true; // Enable timer for level 1
    updateUI();          // Update UI elements
}

// Get current level name
function getLevelName() {
    return levelNames[level - 1] || "Unknown";  // Get level name or "Unknown" if out of bounds
}

// Start the quiz
function startQuiz() {
    console.log("Starting quiz...");
    generateNewQuestions();
    document.getElementById("ready-container").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    inQuiz = true;
    resetGame();  // ✅ Call to resetGame() added here
    startBufferTime();
    setTimeout(() => loadRandomQuiz(getLevelName()), 2000);  // Pass current level name
}

// Check the typed answer
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
        if (score % 5 === 0) {
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
    setTimeout(() => loadRandomQuiz(getLevelName()), 1000);  // Pass current level name
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
function improveLevel() {
    console.log("Improving level...");
    level = Math.max(1, level);
    resetGame();
    startQuiz();
}

// Proceed to next level without a timer
function nextLevel() {
    console.log("Proceeding to next level...");
    level++;
    timerEnabled = false;
    clearInterval(timerInterval);

    document.getElementById("final-score").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";

    updateUI();
    loadRandomQuiz(getLevelName());  // ✅ Load questions for the next level only
}

// Restart the quiz
function restartQuiz() {
    resetGame();
    document.getElementById("final-score").style.display = "none";
    document.getElementById("ready-container").style.display = "block";
}
