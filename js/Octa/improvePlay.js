// improvePlay.js - Improve Level Logic

const levelNames = ["Iron", "Bronze", "Silver", "Gold", "Diamond"];

// Display level buttons based on completed levels


// Start a level to improve
// Start a level to improve
function startLevel(level) {
    console.log(`Starting ${level} level in Improve Mode...`);

    if (!level) {
        console.error("Error: No level selected for improvement!");
        return;
    }

    sessionStorage.setItem("improveMode", "true");
    sessionStorage.setItem("currentLevel", level);

    console.log(`Improve Mode now set: ${sessionStorage.getItem("improveMode")}`);
    window.location.href = "randomPlay.html";
}


// Go back to the main menu
function goBack() {
    localStorage.removeItem("improveMode");
    window.location.href = "Home.html";
}

// Display level buttons based on reached levels
function displayLevelButtons() {
    const levelButtons = document.getElementById("level-buttons");
    const bestTimes = JSON.parse(localStorage.getItem("bestTimes")) || {};
    const reachedLevels = JSON.parse(localStorage.getItem("reachedLevels")) || ["Iron"];  // ✅ Default to Iron

    console.log("Loaded reachedLevels:", reachedLevels); // ✅ Debugging check

    levelButtons.innerHTML = ""; // ✅ Clear previous buttons before adding new ones

    levelNames.forEach((level) => {
        if (reachedLevels.includes(level)) {  // ✅ Show only reached levels
            const bestTime = bestTimes[level] !== undefined ? bestTimes[level] + " seconds" : "--:--";
            const button = document.createElement("button");
            button.innerText = `${level} (Best Time: ${bestTime})`;
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








