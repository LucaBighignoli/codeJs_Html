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

// Load a new question from sessionStorage for the given level
function loadRandomQuiz(currentLevelName) {
    const questions = JSON.parse(sessionStorage.getItem("questions"));
    if (!questions) return;

    // Filter questions based on the current level name
    const levelQuestions = questions.filter(q => q.difficulty === currentLevelName);
    if (levelQuestions.length === 0) {
        console.error(`No questions found for level: ${currentLevelName}`);
        return;
    }

    const randomIndex = Math.floor(Math.random() * levelQuestions.length);
    const quizData = levelQuestions[randomIndex];

    currentCorrectAnswer = quizData.answer;
    document.getElementById("question").innerText = quizData.question;
    document.getElementById("answer-input").value = "";
    document.getElementById("feedback").innerText = "";
}
