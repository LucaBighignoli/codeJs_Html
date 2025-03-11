// ui.js - UI Updates and Feedback

function displayFeedback(message, color) {
    const feedback = document.getElementById("feedback");
    feedback.innerText = message;
    feedback.style.color = color;
}

function updateUI() {
    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("lives").innerText = `Lives: ${lives}`;
    document.getElementById("level").innerText = `Level: ${getLevelName()}`;  // ✅ Show level names
}

function endQuiz() {
    clearInterval(timerInterval);
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("final-score").style.display = "block";
    document.getElementById("score-display").innerText = `You answered ${score} questions correctly!`;
}
