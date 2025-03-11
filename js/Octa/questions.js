// questions.js - Handling Questions

let currentCorrectAnswer = null;

function generateNewQuestions() {
    fetch('./octajson.json')
        .then(response => response.json())
        .then(data => {
            sessionStorage.setItem("questions", JSON.stringify(data));
        })
        .catch(error => console.error("Error generating questions:", error));
}

// Load a new question for the selected level
function loadRandomQuiz(currentLevelName) {
    console.log(`Loading questions for level: ${currentLevelName}`);

    // Retrieve questions from sessionStorage
    let questions = JSON.parse(sessionStorage.getItem("questions"));

    // ✅ Ensure questions are loaded correctly
    if (!questions || !Array.isArray(questions)) {
        console.error("Error: No valid questions found in sessionStorage.");
        return;
    }

    // ✅ Get level from `sessionStorage` for Improve Mode
    let improveMode = sessionStorage.getItem("improveMode") === "true";
    let levelToLoad = improveMode ? sessionStorage.getItem("currentLevel") : currentLevelName;

    if (!levelToLoad) {
        console.error("Error: currentLevel is null! Fixing...");
        levelToLoad = sessionStorage.getItem("currentLevel") || "Iron";  // ✅ Fallback to Iron
    }

    console.log(`Using level: ${levelToLoad}`);

    const levelQuestions = questions.filter(q => q.difficulty === levelToLoad);
    if (levelQuestions.length === 0) {
        console.error(`No questions found for level: ${levelToLoad}`);
        return;
    }

    const randomIndex = Math.floor(Math.random() * levelQuestions.length);
    const quizData = levelQuestions[randomIndex];

    currentCorrectAnswer = quizData.answer;
    document.getElementById("question").innerText = quizData.question;
    document.getElementById("answer-input").value = "";
    document.getElementById("feedback").innerText = "";
}




