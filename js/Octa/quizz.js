let timeLeft = 90;
let timerInterval;
let score = 0;
let lives = 3;
let level = 1;
let bestScore = 0;
let bestTime = null;
let firstLevelTime = null;
let inQuiz = false;
let inImproveMode = false;
let currentCorrectAnswer = null;
let timerEnabled = true;  // ✅ Controls if the timer should run

// Buffer time before starting the main timer
function startBufferTime() {
    console.log("Starting buffer time...");
    const bufferDuration = 4;  // 4 seconds buffer
    let bufferTimeLeft = bufferDuration;

    const bufferInterval = setInterval(() => {
        if (bufferTimeLeft > 0) {
            document.getElementById("timer").innerText = `Get Ready... ${bufferTimeLeft}`;
            bufferTimeLeft--;
        } else {
            clearInterval(bufferInterval);
            document.getElementById("timer").innerText = "Go!";
            setTimeout(() => {
                if (timerEnabled) startTimer();  // ✅ Start the main timer only if enabled
            }, 1000);
        }
    }, 1000);
}

// Start the main timer
function startTimer() {
    console.log("Starting main timer...");
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            endQuiz();
        }
    }, 1000);
}

// Update the timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("timer").innerText = `Time Left: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Reset game state

// Redirect based on quiz state (Fixes Back button)
function goBack() {
    if (inQuiz) {
        resetToReadyScreen();
    } else {
        window.location.href = "Home.html";
    }
}

// Generate new questions and store in sessionStorage
function generateNewQuestions() {
    console.log("Fetching questions...");
    fetch('./octajson.json')
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok.");
            return response.json();
        })
        .then(data => {
            sessionStorage.setItem("questions", JSON.stringify(data));
            console.log("New questions generated and saved to sessionStorage.");
        })
        .catch(error => console.error("Error generating questions:", error));
}

// Load a new question from sessionStorage
function loadRandomQuiz() {
    const questions = JSON.parse(sessionStorage.getItem("questions"));
    if (!questions) {
        console.error("No questions available in sessionStorage!");
        return;
    }

    const randomIndex = Math.floor(Math.random() * questions.length);
    const quizData = questions[randomIndex];

    if (!quizData) {
        console.error("Failed to get a quizData.");
        return;
    }

    currentCorrectAnswer = quizData.answer;
    document.getElementById("question").innerText = quizData.question;
    document.getElementById("answer-input").value = "";
    document.getElementById("feedback").innerText = "";
}

// Start the quiz
function startQuiz() {
    console.log("Starting quiz...");
    generateNewQuestions();
    document.getElementById("ready-container").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    inQuiz = true;
    inImproveMode = false;
    resetGame();
    startBufferTime();  // ✅ Start buffer time instead of main timer
    setTimeout(loadRandomQuiz, 2000);  // ⏰ Delay to allow questions to load
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
            showCongratulations();  // ✅ Show congratulations before next level
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
    setTimeout(loadRandomQuiz, 1000);
}

// Show Congratulations and options
function showCongratulations() {
    console.log("Level Up!");
    clearInterval(timerInterval);  // ✅ Stop the timer
    timerEnabled = false;          // ✅ Disable timer for next levels

    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("final-score").style.display = "block";
    document.getElementById("score-display").innerHTML = `
        🎉 Congratulations! You reached Level ${level + 1}!<br><br>
        <button onclick="improveLevel()">Improve</button>
        <button onclick="nextLevel()">Next Level</button>
    `;
}

// Improve level (replay current level)
function improveLevel() {
    console.log("Improving level...");
    level = Math.max(1, level);  // Ensure level is at least 1
    resetGame();
    startQuiz();
}

// Proceed to next level without a timer
function nextLevel() {
    console.log("Proceeding to next level...");
    level++;
    timerEnabled = false;  // Disable timer for next levels
    resetGame();
    document.getElementById("final-score").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    updateUI();
    loadRandomQuiz();  // Continue without timer
}

// Display feedback
function displayFeedback(message, color) {
    const feedback = document.getElementById("feedback");
    feedback.innerText = message;
    feedback.style.color = color;
}

// Update UI elements
function updateUI() {
    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("lives").innerText = `Lives: ${lives}`;
    document.getElementById("level").innerText = `Level: ${level}`;
}

// End the quiz
function endQuiz() {
    clearInterval(timerInterval);
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("final-score").style.display = "block";
    document.getElementById("score-display").innerText = `You answered ${score} questions correctly!`;
}

// Restart the quiz
function restartQuiz() {
    resetGame();
    document.getElementById("final-score").style.display = "none";
    document.getElementById("ready-container").style.display = "block";
}
