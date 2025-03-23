// main.js - Main Game Logic

const levelNames = ["Iron", "Bronze", "Silver", "Gold", "Diamond"];
let improveScore = 0;
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
        const currentLevelName = sessionStorage.getItem("currentLevel");
        level = levelNames.indexOf(currentLevelName) + 1 || 1;

        const bestTimes = JSON.parse(localStorage.getItem("bestTimes")) || [];
        const bestTime = bestTimes[level - 1];

        timeLeft = bestTime || 90;

        improveScore = 0; // ✅ Separate score for improve mode
        console.log(`🚀 Improve Mode ACTIVE: ${currentLevelName}, Time = ${timeLeft}s`);
    } else {
        let savedLevel = localStorage.getItem("currentLevel");
        level = savedLevel && levelNames.includes(savedLevel)
            ? levelNames.indexOf(savedLevel) + 1
            : 1;

        timeLeft = parseInt(localStorage.getItem("currentTimeLeft")) || 90;
        score = parseInt(localStorage.getItem("currentScore")) || 0;
        console.log("🎮 Normal Play Mode: Level =", getLevelName(), ", Score =", score);
    }

    localStorage.setItem("currentLevel", getLevelName());

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

    const improveMode = sessionStorage.getItem("improveMode") === "true";

    if (isNaN(userAnswer)) {
        displayFeedback("Please enter a valid number.", "orange");
    } else if (userAnswer === currentCorrectAnswer) {
        if (improveMode) {
            improveScore++;
            console.log("✅ Correct! (Improve Mode) Score:", improveScore);
            if (improveScore >= 15) {
                // ✅ You completed the level
                clearInterval(timerInterval);

                const levelIndex = level - 1;
                const bestTimes = JSON.parse(localStorage.getItem("bestTimes")) || [];
                const timeTaken = (bestTimes[levelIndex] || 90) - timeLeft;

                console.log(`🎯 Improve Mode completed! Time taken: ${timeTaken}s`);

                // ✅ Update best time only if this one is faster
                if (!bestTimes[levelIndex] || timeTaken < bestTimes[levelIndex]) {
                    bestTimes[levelIndex] = timeTaken;
                    localStorage.setItem("bestTimes", JSON.stringify(bestTimes));
                    alert(`🎉 New best time for ${getLevelName()}: ${timeTaken}s`);
                } else {
                    alert(`✅ Completed! Your time: ${timeTaken}s\nBest time remains: ${bestTimes[levelIndex]}s`);
                }

                // ✅ Go back to Improve Mode menu
                window.location.href = "improvePlay.html";
                return;
            }

        } else {
            score++;
            localStorage.setItem("currentScore", score);
            console.log("✅ Correct! (Normal Mode) Score:", score);
        }

        displayFeedback("✅ Correct!", "green");

        if (score%15===0&& !improveMode) {
            showCongratulations();

            // ✅ Automatically advance to next level after short delay
            setTimeout(() => {
                nextLevel();
            }, 3000); // Optional delay to let the user see the congrats message

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

    answerInput.value = "";
    updateUI();
    setTimeout(() => loadRandomQuiz(getLevelName()), 1000);
}

// Show Congratulations and options
function showCongratulations() {
    console.log("Level Up!");
    clearInterval(timerInterval);
    timerEnabled = false;

    const currentLevelIndex = level - 1;
    const timeTaken = 90 - timeLeft;

    // Load current bestTimes or initialize
    let bestTimes = JSON.parse(localStorage.getItem("bestTimes")) || [];

    // Save best time if it's better (or not set)
    if (!bestTimes[currentLevelIndex] || timeTaken < bestTimes[currentLevelIndex]) {
        bestTimes[currentLevelIndex] = timeTaken;
        localStorage.setItem("bestTimes", JSON.stringify(bestTimes));
        console.log(`⏱️ New best time for ${getLevelName()}: ${timeTaken}s`);
    } else {
        console.log(`⏱️ Time for ${getLevelName()}: ${timeTaken}s (Best: ${bestTimes[currentLevelIndex]}s)`);
    }

    const nextLevelName = getLevelName();

    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("final-score").style.display = "block";
    document.getElementById("score-display").innerHTML = `
    🎉 Congratulations! You reached ${nextLevelName} level!<br>
    Automatically moving to the next level...
    <br><br>
    <button onclick="improveLevel()">Improve This Level</button>
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

    clearInterval(timerInterval); // ✅ Stop the timer immediately

    // ✅ Round down to nearest multiple of 15
    if (score % 15 !== 0) {
        score = Math.floor(score / 15) * 15;
        localStorage.setItem("currentScore", score); // ✅ Save updated score
        console.log(`🔁 Score rounded down to ${score}`);
    }

    // ✅ If the quiz is active, restart it instead of leaving
    if (document.getElementById("quiz-container").style.display === "block") {
        restartQuiz();  // ✅ Calls restartQuiz() to avoid repeated code
    } else {
        console.log("🏠 Returning to main menu...");
        window.location.href = "Home.html";  // ✅ Default behavior for menus
    }
}

function restartQuiz() {
    console.log("🔄 Restarting quiz...");

    clearInterval(timerInterval); // ✅ Stop the timer
    inQuiz = false;

    const isImproveMode = sessionStorage.getItem("improveMode") === "true";

    if (isImproveMode) {
        console.log("🚀 Improve Mode active — redirecting to improvePlay.html...");
        window.location.href = "improvePlay.html"; // ✅ Go to level selector
        return;
    }

    // ✅ Normal Mode restart
    // Round down score to nearest multiple of 15
    const originalScore = score;
    score = Math.floor(score / 15) * 15;
    localStorage.setItem("currentScore", score);
    resetGame();

    console.log(`🎯 Score adjusted: ${originalScore} ➡ ${score}`);

    // Reset view to ready screen
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("final-score").style.display = "none";
    document.getElementById("ready-container").style.display = "block";
    document.getElementById("score").innerText = `Score: ${score}`;

    console.log(`➡️ Ready to start again from level: ${getLevelName()}, Score: ${score}`);
}

document.addEventListener("DOMContentLoaded", function() {
    console.log("🔄 Retrieving saved game progress...");

    let reachedLevels = JSON.parse(localStorage.getItem("reachedLevels")) || ["Iron"]; // Default to ["Iron"]

    // Get the last level reached from the array
    let lastReachedLevel = reachedLevels[reachedLevels.length - 1];

    if (lastReachedLevel && levelNames.includes(lastReachedLevel)) {
        level = levelNames.indexOf(lastReachedLevel) + 1;
        localStorage.setItem("currentLevel", lastReachedLevel); // ✅ Sync current level with last reached level
    } else {
        level = 1; // Default to Iron
        localStorage.setItem("currentLevel", "Iron"); // ✅ Ensure currentLevel is set correctly
    }

    score = parseInt(localStorage.getItem("currentScore")) || 0;
    timeLeft = parseInt(localStorage.getItem("currentTimeLeft")) || 90;

    console.log(`✅ Game Loaded: Level ${getLevelName()}, Score: ${score}, Time Left: ${timeLeft} sec`);

    // ✅ Immediately update UI to reflect the correct level
    updateUI();
});
document.addEventListener("DOMContentLoaded", function() {
    console.log("🔄 Retrieving saved game progress...");

    let reachedLevels = JSON.parse(localStorage.getItem("reachedLevels")) || ["Iron"];

    // Get the last level reached from the array
    let lastReachedLevel = reachedLevels[reachedLevels.length - 1];

    if (lastReachedLevel && levelNames.includes(lastReachedLevel)) {
        level = levelNames.indexOf(lastReachedLevel) + 1;
        localStorage.setItem("currentLevel", lastReachedLevel); // ✅ Sync current level with last reached level
    } else {
        level = 1; // Default to Iron
        localStorage.setItem("currentLevel", "Iron"); // ✅ Ensure currentLevel is set correctly
    }

    score = parseInt(localStorage.getItem("currentScore")) || 0;
    timeLeft = parseInt(localStorage.getItem("currentTimeLeft")) || 90;

    console.log(`✅ Game Loaded: Level ${getLevelName()}, Score: ${score}, Time Left: ${timeLeft} sec`);

    // ✅ Immediately update UI to reflect the correct level
    updateUI();

    document.addEventListener("DOMContentLoaded", () => {
        displayLevelButtons(); // ✅ Show the level buttons

        // ✅ Reset Progress button logic
        document.getElementById("reset-progress-btn").addEventListener("click", function () {
            if (confirm("Are you sure you want to reset all progress? This cannot be undone!")) {
                localStorage.clear();
                sessionStorage.clear();
                location.reload();
            }
        });

        // ✅ Improve Mode button logic
        const improveModeBtn = document.getElementById("improve-mode-btn");
        const improveModeActive = sessionStorage.getItem("improveMode") === "true";

        // ✅ Set initial button text
        improveModeBtn.innerText = improveModeActive ? "Normal Mode" : "Improve Mode";

        improveModeBtn.addEventListener("click", function () {
            if (sessionStorage.getItem("improveMode") === "true") {
                // 🔁 Turn OFF Improve Mode
                sessionStorage.removeItem("improveMode");
                sessionStorage.removeItem("currentLevel");
                alert("✅ Switched to Normal Mode");
                improveModeBtn.innerText = "Improve Mode";
                window.location.href = "Home.html";
            } else {
                // 🔁 Turn ON Improve Mode
                sessionStorage.setItem("improveMode", "true");
                alert("✅ Improve Mode Enabled");
                improveModeBtn.innerText = "Normal Mode";
                window.location.href = "improvePlay.html";
            }
        });
    });
    document.addEventListener("DOMContentLoaded", () => {
        displayLevelButtons();

        const backToNormalBtn = document.getElementById("back-to-normal-btn");

        if (sessionStorage.getItem("improveMode") === "true") {
            backToNormalBtn.style.display = "inline-block";
        }

        backToNormalBtn.addEventListener("click", () => {
            sessionStorage.setItem("improveMode", "false"); // ✅ Set to false instead of removing
            sessionStorage.removeItem("currentLevel"); // Optional cleanup
            console.log("🔁 Improve Mode turned OFF (set to false).");
        });
    });


});








