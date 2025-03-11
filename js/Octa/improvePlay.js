
    // improvePlay.js - Improve Level Logic

    const levelNames = ["Iron", "Bronze", "Silver", "Gold", "Diamond"];

    // Display level buttons based on completed levels
    function displayLevelButtons() {
        const levelButtons = document.getElementById("level-buttons");
        const bestTimes = JSON.parse(localStorage.getItem("bestTimes")) || {};

        levelNames.forEach((level, index) => {
            if (bestTimes[level]) {
                const bestTime = bestTimes[level] || "--:--";
                const button = document.createElement("button");
                button.innerText = `${level} (Best Time: ${bestTime} seconds)`;
                button.onclick = () => startLevel(level);
                levelButtons.appendChild(button);
            }
        });
    }

    // Start a level to improve the time
    function startLevel(level) {
        console.log(`Starting ${level} level...`);
        localStorage.setItem("currentLevel", level);
        window.location.href = "randomPlay.html";
    }

    // Go back to the main menu
    function goBack() {
        window.location.href = "Home.html";
    }

    // Display level buttons on page load
    document.addEventListener("DOMContentLoaded", displayLevelButtons);
    