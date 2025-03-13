document.addEventListener("DOMContentLoaded", () => {
    displayPlayerLevels();
});

function displayPlayerLevels() {
    let playerStats = JSON.parse(sessionStorage.getItem("overallTraining")) || {
        stats: {
            Addition: { level: "Easy" },
            Subtraction: { level: "Easy" },
            Multiplication: { level: "Easy" },
            Division: { level: "Easy" }
        }
    };

    let levelsText = `
        <strong>Current Levels:</strong><br>
        Addition: ${playerStats.stats.Addition.level} <br>
        Subtraction: ${playerStats.stats.Subtraction.level} <br>
        Multiplication: ${playerStats.stats.Multiplication.level} <br>
        Division: ${playerStats.stats.Division.level} 
    `;

    document.getElementById("player-levels").innerHTML = levelsText;
}

document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("toggle-btn");

    // Load saved state from localStorage
    if (localStorage.getItem("toggleState") === "on") {
        toggleBtn.checked = true;
    }

    toggleBtn.addEventListener("change", () => {
        if (toggleBtn.checked) {
            console.log("Feature Enabled");
            localStorage.setItem("toggleState", "on");
        } else {
            console.log("Feature Disabled");
            localStorage.setItem("toggleState", "off");
        }
    });
});