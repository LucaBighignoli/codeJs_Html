// timer.js - Timer and Buffer Logic

let timeLeft = 90;
let timerInterval;

function startBufferTime() {
    const bufferDuration = 4;
    let bufferTimeLeft = bufferDuration;

    const bufferInterval = setInterval(() => {
        if (bufferTimeLeft > 0) {
            document.getElementById("timer").innerText = `Get Ready... ${bufferTimeLeft}`;
            bufferTimeLeft--;
        } else {
            clearInterval(bufferInterval);
            document.getElementById("timer").innerText = "Go!";
            setTimeout(() => {
                if (timerEnabled) startTimer();
            }, 1000);
        }
    }, 1000);
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            endQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("timer").innerText = `Time Left: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}