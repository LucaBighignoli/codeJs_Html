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
    window.location.href = "index.html";
}

// Display level buttons based on reached levels
function displayLevelButtons() {
    const levelButtons = document.getElementById("level-buttons");
    const bestTimes = JSON.parse(localStorage.getItem("bestTimes")) || [];
    const reachedLevels = JSON.parse(localStorage.getItem("reachedLevels")) || ["Iron"];

    console.log("Loaded reachedLevels:", reachedLevels);

    levelButtons.innerHTML = "<h2>Choose a Level to Improve:</h2>";

    levelNames.forEach((level, index) => {
        // ✅ Only show levels that are in reachedLevels AND have a valid best time
        const hasBeenCompleted = reachedLevels.includes(level);
        const hasBestTime = bestTimes[index] !== undefined && !isNaN(bestTimes[index]);

        if (hasBeenCompleted && hasBestTime) {
            const bestTime = bestTimes[index] + " seconds";

            const button = document.createElement("button");
            button.innerText = `${level} (Best Time: ${bestTime})`;
            button.onclick = function () {
                sessionStorage.setItem("currentLevel", level);
                startLevel(level);
            };

            levelButtons.appendChild(button);
        }
    });

    // ✅ If no buttons were added, show a message
    if (levelButtons.children.length <= 1) {
        const msg = document.createElement("p");
        msg.innerText = "No levels available to improve yet. Play levels first!";
        levelButtons.appendChild(msg);
    }
}

// Run on page load
document.addEventListener("DOMContentLoaded", displayLevelButtons);









