// improvePlay.js - Improve Level Logic

const levelNames = ["Iron", "Bronze", "Silver", "Gold", "Diamond"];

// Display level buttons based on completed levels
function displayLevelButtons() {
    const levelButtons = document.getElementById("level-buttons");
    const bestTimes = JSON.parse(localStorage.getItem("bestTimes")) || {};

    levelNames.forEach((level) => {
        if (bestTimes[level]) {
            const bestTime = bestTimes[level] || "--:--";
            const button = document.createElement("button");
            button.innerText = `${level} (Best Time: ${bestTime} seconds)`;
            button.onclick = () => startLevel(level);
            levelButtons.appendChild(button);
        }
    });
}

// Start a level to improve
function startLevel(level) {
    console.log(`Starting ${level} level...`);

    if (!level) {
        console.error("Error: No level selected for improvement!");
        return;
    }

    // ✅ Store Improve Mode settings in `sessionStorage`
    sessionStorage.setItem("improveMode", "true");
    sessionStorage.setItem("currentLevel", level);  // ✅ Store selected level

    console.log(`Stored currentLevel: ${level} in sessionStorage`);
    window.location.href = "randomPlay.html";  // ✅ Redirect to play the selected level
}
// Go back to the main menu
function goBack() {
    localStorage.removeItem("improveMode");
    window.location.href = "Home.html";
}

// Display level buttons on page load
document.addEventListener("DOMContentLoaded", displayLevelButtons);
// Display level buttons based on completed levels

// Display level buttons based on reached levels
function displayLevelButtons() {
    const levelButtons = document.getElementById("level-buttons");
    const bestTimes = JSON.parse(localStorage.getItem("bestTimes")) || {};
    const reachedLevels = JSON.parse(localStorage.getItem("reachedLevels")) || ["Iron"];  // ✅ Default to Iron

    levelButtons.innerHTML = ""; // ✅ Clear previous buttons before adding new ones

    levelNames.forEach((level) => {
        if (reachedLevels.includes(level)) {  // ✅ Show only reached levels
            const bestTime = bestTimes[level] || "--:--";
            const button = document.createElement("button");
            button.innerText = `${level} (Best Time: ${bestTime} seconds)`;
            button.onclick = function () {
                sessionStorage.setItem("currentLevel", level);  // ✅ Store level in `sessionStorage`
                startLevel(level);  // ✅ Ensure button click passes the level correctly
            };
            levelButtons.appendChild(button);
        }
    });
}

// Run on page load
document.addEventListener("DOMContentLoaded", displayLevelButtons);

// Run on page load
document.addEventListener("DOMContentLoaded", displayLevelButtons);

