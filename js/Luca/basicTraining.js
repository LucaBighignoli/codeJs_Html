let trainingQuestions = [];
let currentQuestionIndex = 0;
let incorrectQuestions = []; // ✅ Store incorrect answers

let categoryStats = {
    Addition: { correct: 0, total: 0, timeTaken: 0 },
    Subtraction: { correct: 0, total: 0, timeTaken: 0 },
    Multiplication: { correct: 0, total: 0, timeTaken: 0 },
    Division: { correct: 0, total: 0, timeTaken: 0 }
};
let questionStartTime = 0; // Track when question appears

// ✅ Function to update the progress bar
function updateProgressBar() {
    let progressBar = document.getElementById("progress-bar");
    if (!progressBar) return;  // ✅ Prevent error if element is missing

    let progress = ((currentQuestionIndex) / trainingQuestions.length) * 100;
    progressBar.style.width = progress + "%";
}

// ✅ Load training questions when the page loads
document.addEventListener("DOMContentLoaded", async function () {
    trainingQuestions = await getTrainingQuestions();  // Fetch 20 shuffled questions
    if (trainingQuestions.length > 0) {
        displayQuestion(trainingQuestions[currentQuestionIndex]);  // Show first question
    } else {
        document.getElementById("question-text").innerText = "No questions available.";
    }
});

function displayQuestion(question) {
    // Display the question text along with its difficulty level
    document.getElementById("question-text").innerText = `${question.question} (Level: ${question.difficulty})`;
    
    let optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = ""; // Clear previous options

    question.options.forEach((option) => {
        let button = document.createElement("button");
        button.innerText = option;
        button.classList.add("quiz-option"); // Add quiz option class
        button.onclick = () => checkAnswer(question, option, button);
        optionsDiv.appendChild(button);
    });
    
    // Record the start time for this question
    questionStartTime = Date.now();
}

// ✅ Function to check answer and move to the next question
function checkAnswer(question, selectedOption, buttonElement) {
    let isCorrect = selectedOption === question.answer;
    document.getElementById("result").innerText = isCorrect ? "Correct! 🎉" : "Wrong! ❌";

    // ✅ Apply correct/wrong styles
    buttonElement.classList.add(isCorrect ? "correct-answer" : "wrong-answer");

    let category = question.category;
    let timeTaken = (Date.now() - questionStartTime) / 1000; // Time in seconds

    if (!question.answered) {
        question.answered = true;
        categoryStats[category].total++;
        categoryStats[category].timeTaken += timeTaken;
        if (isCorrect) {
            categoryStats[category].correct++;
        } else {
            incorrectQuestions.push(question);
        }
    }

    setTimeout(() => {
        currentQuestionIndex++;
        updateProgressBar();
        if (currentQuestionIndex < trainingQuestions.length) {
            displayQuestion(trainingQuestions[currentQuestionIndex]);
            document.getElementById("result").innerText = "";
        } else {
            endTrainingSession();
        }
    }, 1000);
}

function endTrainingSession() {
    document.getElementById("question-text").innerText = "Training Complete!";
    document.getElementById("options").innerHTML = "";  // Clear options

    document.getElementById("finish-training").style.display = "block"; // ✅ Show Finish button
    document.getElementById("see-stats").style.display = "block"; // Show See the results button
    if (incorrectQuestions.length > 0) {
        document.getElementById("retry-incorrect").style.display = "block"; // ✅ Show Retry button
    }

    // ✅ Calculate & display stats
    let statsText = "Category Performance:\n";
    Object.keys(categoryStats).forEach(category => {
        let correct = categoryStats[category].correct;
        let total = categoryStats[category].total;
        let avgTime = total > 0 ? (categoryStats[category].timeTaken / total).toFixed(2) : "N/A";
        statsText += `${category}: ${correct}/${total} correct | Avg Time: ${avgTime}s\n`;
    });

    // ✅ Store stats for tailored trainin
    sessionStorage.setItem("trainingStats", JSON.stringify(categoryStats));

    let playerStats = JSON.parse(sessionStorage.getItem("overallTraining")) || {
        stats: {
            Addition: { level: "Easy", correct: 0, total: 0 ,time: 0},
            Subtraction: { level: "Easy", correct: 0, total: 0 ,time: 0},
            Multiplication: { level: "Easy", correct: 0, total: 0 ,time: 0},
            Division: { level: "Easy", correct: 0, total: 0,time:0}
        },
        gamesPlayed: 0
    };
    

    Object.keys(categoryStats).forEach(category => {
        playerStats.stats[category].time = (playerStats.stats[category].time*(playerStats.stats[category].total)+ categoryStats[category].timeTaken)/(playerStats.stats[category].total+categoryStats[category].total);  
        playerStats.stats[category].correct += categoryStats[category].correct;
        playerStats.stats[category].total += categoryStats[category].total;
    });
    sessionStorage.setItem("overallTraining", JSON.stringify(playerStats));
    sessionStorage.removeItem("tailoredTrainingQueue");  // ✅ Ensure old queue is removed

    

    adjustUserLevels(); // ✅ Adjust user levels based on performance  
}

function retryIncorrectQuestions() {
    if (incorrectQuestions.length === 0) return;

    trainingQuestions = [...incorrectQuestions];  // ✅ Replace questions with incorrect ones
    incorrectQuestions = [];  // ✅ Reset incorrect questions list
    currentQuestionIndex = 0;  // ✅ Restart at the first question

    document.getElementById("retry-incorrect").style.display = "none"; // Hide button
    document.getElementById("finish-training").style.display = "none"; // Hide finish button
    updateProgressBar(); // Reset progress
    displayQuestion(trainingQuestions[currentQuestionIndex]);  // ✅ Show first incorrect question
}


async function getTrainingQuestions() {
    try {
        // Load questions from JSON file
        let response = await fetch("../data/questions.json");
        let allQuestions = await response.json();

        // Get player's current levels
        let playerStats = JSON.parse(sessionStorage.getItem("overallTraining")) || {
            stats: {
                Addition: { level: "Easy", correct: 0, total: 0 ,time: 0},
                Subtraction: { level: "Easy", correct: 0, total: 0 ,time: 0},
                Multiplication: { level: "Easy", correct: 0, total: 0 ,time: 0},
                Division: { level: "Easy", correct: 0, total: 0,time:0}
            },
            gamesPlayed: 0
        };

        let selectedQuestions = [];

        // List of categories
        let categories = ["Addition", "Subtraction", "Multiplication", "Division"];
        
        // Retrieve toggle state from localStorage
        let toggleState = localStorage.getItem("toggleState") === "on";
        console.log("Toggle State:", toggleState);

        // ✅ Select 5 questions per category based on toggle state
        categories.forEach(category => {
            let filteredQuestions = toggleState 
                ? allQuestions.filter(q => q.category === category) // Ignore difficulty level
                : allQuestions.filter(q => q.category === category && q.difficulty === playerStats.stats[category].level); // Based on user level
            
            // Pick 5 random questions for this category
            let pickedQuestions = getRandomQuestions(filteredQuestions, 5);
            selectedQuestions.push(...pickedQuestions);
        });

        console.log("Training Questions:", selectedQuestions);
        return shuffleArray(selectedQuestions);  // Can be used for training session
    } catch (error) {
        console.error("Error loading training questions:", error);
        return [];
    }
}

// ✅ Function to randomly pick N questions
function getRandomQuestions(questionArray, num) {
    let shuffled = questionArray.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

function goBackToTraining() {
    window.location.href = "trainingHome.html"; // Redirect to Training Menu
}

function adjustUserLevels() {
    // Retrieve training performance data
    let trainingStats = JSON.parse(sessionStorage.getItem("trainingStats")) || {};

    // Retrieve player's stats from sessionStorage, or use defaults
    let playerStats = JSON.parse(sessionStorage.getItem("overallTraining")) || {
        stats: {
            Addition: { level: "Easy", correct: 0, total: 0 ,time: 0},
            Subtraction: { level: "Easy", correct: 0, total: 0 ,time: 0},
            Multiplication: { level: "Easy", correct: 0, total: 0 ,time: 0},
            Division: { level: "Easy", correct: 0, total: 0,time:0 }
        },
        gamesPlayed: 0
    };

    // Iterate through each category in the trainingStats
    Object.keys(trainingStats).forEach(category => {
        let correct = trainingStats[category].correct;
        let total = trainingStats[category].total;
        let avgTime = total > 0 ? (trainingStats[category].timeTaken / total) : 999; // Default high time if no data

        // Increase difficulty if the user got all 5 questions correct and the average time is 5 seconds or less
        if (correct === 5 && avgTime <= 2.5) {
            if (playerStats.stats[category].level === "Easy") {
                playerStats.stats[category].level = "Medium";
                playerStats.stats[category].correct = 0;
                playerStats.stats[category].total = 0;
                playerStats.stats[category].time = 0;
            } else if (playerStats.stats[category].level === "Medium") {
                playerStats.stats[category].correct = 0;
                playerStats.stats[category].total = 0;
                playerStats.stats[category].time = 0;
                playerStats.stats[category].level = "Difficult";
            }
        }
        // Decrease difficulty if the user got 2 or fewer correct answers
        else if (correct <= 1) {
            if (playerStats.stats[category].level === "Difficult") {
                playerStats.stats[category].correct = 0;
                playerStats.stats[category].total = 0;
                playerStats.stats[category].time = 0;
                playerStats.stats[category].level = "Medium";
            } else if (playerStats.stats[category].level === "Medium") {
                playerStats.stats[category].correct = 0;
                playerStats.stats[category].total = 0;
                playerStats.stats[category].time = 0;
                playerStats.stats[category].level = "Easy";
            }
        }
    });

    // Save the updated playerStats back to sessionStorage
    sessionStorage.setItem("overallTraining", JSON.stringify(playerStats));
    console.log("Updated Player Stats:", playerStats);
}

function seeStats() {
    window.location.href = "stats.html";
}