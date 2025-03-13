document.addEventListener("DOMContentLoaded", getTrainingMode());

async function getTailoredTrainingQuestions() {
    try {
        let response = await fetch("../data/questions.json");
        let allQuestions = await response.json();
        let trainingMode = getTrainingMode();

        if (!trainingMode) {
            return []; // No training needed
        }

        let playerStats = JSON.parse(sessionStorage.getItem("overallTraining")) || {};
        let category = trainingMode.category;
        let currentLevel = playerStats.stats[category].level;
        let difficultyRank = { "Easy": 1, "Medium": 2, "Difficult": 3 };

        let questionLevel = trainingMode.mode === "Speed Training"
            ? (difficultyRank[currentLevel] > 1 ? "Easy" : currentLevel) // Speed training lowers difficulty
            : currentLevel; // Accuracy training stays at the current level

        let filteredQuestions = allQuestions.filter(q => q.category === category && q.difficulty === questionLevel);
        let selectedQuestions = getRandomQuestions(filteredQuestions, 10); // Select 10 questions

        console.log("Tailored Training Questions:", selectedQuestions);
        return shuffleArray(selectedQuestions);
    } catch (error) {
        console.error("Error loading tailored training questions:", error);
        return [];
    }
}

let currentIndex=0;
let questions=[];
let correctQuestions=0;

async function getTrainingMode() {
    let trainingQueue = JSON.parse(sessionStorage.getItem("tailoredTrainingQueue")) || [];


    // If no queue exists, generate one
    if (trainingQueue.length === 0) {
        console.log("No queued training. Running analysis...");
        findTrainingPrioritiesV2();
        trainingQueue = JSON.parse(sessionStorage.getItem("tailoredTrainingQueue")) || [];
    }

    let nextTraining = trainingQueue.shift();
    sessionStorage.setItem("tailoredTrainingQueue", JSON.stringify(trainingQueue));
    questions = await getNextTrainingQuestions(nextTraining);

    displayQuestion(questions[currentIndex]);
    showTrainingGoal(nextTraining); 



    

    console.log(`Next Tailored Training: ${nextTraining.category} (${nextTraining.trainingType})`);
    return nextTraining;
}

function findTrainingPriorities() {
    let playerStats = JSON.parse(sessionStorage.getItem("overallTraining")) || {};
    let trainingStats = JSON.parse(sessionStorage.getItem("trainingStats")) || {};
    
    let trainingQueue = [];
    let lastTraining = JSON.parse(sessionStorage.getItem("lastTailoredTraining")) || null;

    // Define numerical values for difficulty levels
    const difficultyRank = { "Easy": 1, "Medium": 2, "Difficult": 3 };

    let categories = [];

    Object.keys(playerStats.stats).forEach(category => {
        let overallCorrect = playerStats.stats[category].correct;
        let overallTotal = playerStats.stats[category].total;
        let overallTime = playerStats.stats[category].time;
        let lastSessionCorrect = trainingStats[category]?.correct || 0;
        let lastSessionTotal = trainingStats[category]?.total || 1;
        let lastSessionTime = trainingStats[category]?.timeTaken || 999;

        let overallAccuracy = overallTotal > 0 ? (overallCorrect / overallTotal) * 100 : 100;
        let lastSessionAccuracy = (lastSessionCorrect / lastSessionTotal) * 100;
        let overallAvgTime = overallTotal > 0 ? overallTime : 999;
        let lastSessionAvgTime = lastSessionTotal > 0 ? lastSessionTime / lastSessionTotal : 999;

        let level = playerStats.stats[category].level;
        let difficultyValue = difficultyRank[level];

        // **Calculate Weighted Accuracy and Speed**
        let weightedAccuracy = (0.6 * lastSessionAccuracy) + (0.4 * overallAccuracy);
        let weightedSpeed = (0.6 * lastSessionAvgTime) + (0.4 * overallAvgTime);

        // **Define Weakness Scores**
        let accuracyWeaknessScore = 100 - weightedAccuracy;
        let speedWeaknessScore = (weightedSpeed > 5) ? weightedSpeed : 0;

        // **Adjust by difficulty (lower difficulty → higher priority)**
        let adjustedAccuracyWeakness = accuracyWeaknessScore / difficultyValue;
        let adjustedSpeedWeakness = speedWeaknessScore / difficultyValue;
        let balancedWeaknessScore = (adjustedAccuracyWeakness + adjustedSpeedWeakness) / 2;

        // Store all options
        categories.push({
            category,
            accuracyScore: adjustedAccuracyWeakness,
            speedScore: adjustedSpeedWeakness,
            balancedScore: balancedWeaknessScore,
            level
        });
    });

    // **Sort by priority**
    categories.sort((a, b) => (b.accuracyScore + b.speedScore) - (a.accuracyScore + a.speedScore));

    // **Generate training queue, but only add speed training if needed**
    categories.forEach(categoryData => {
        if (categoryData.accuracyScore > 0) {
            trainingQueue.push({ category: categoryData.category, mode: "Accuracy Training" });
        }
        if (categoryData.speedScore > 0 && categoryData.speedScore > 5) {  // ✅ Only include speed if >5s
            trainingQueue.push({ category: categoryData.category, mode: "Speed Training" });
        }
        if (categoryData.accuracyScore > 0 && categoryData.speedScore > 0) {
            trainingQueue.push({ category: categoryData.category, mode: "Balanced Training" });
        }
    });

    // **Avoid Repeating Last Training**
    if (lastTraining) {
        trainingQueue = trainingQueue.filter(training => training.category !== lastTraining.category);
    }

    sessionStorage.setItem("tailoredTrainingQueue", JSON.stringify(trainingQueue));
    
    console.log("Generated Training Queue:", trainingQueue);
}

function findTrainingPrioritiesV2() {
    let trainingStats = JSON.parse(sessionStorage.getItem("trainingStats")) || {};
    let playerStats = JSON.parse(sessionStorage.getItem("overallTraining")) || {};
    
    let trainingQueue = [];
    const difficultyRank = { "Easy": 1, "Medium": 2, "Difficult": 3 };

    let categorizedTraining = {
        accuracy: [],
        speed: [],
        balanced: []
    };
    
    // ✅ If trainingStats is empty, add Balanced Training for all categories
    if (Object.keys(trainingStats).length === 0) {
        Object.keys(playerStats.stats).forEach(category => {
            trainingQueue.push({ category, trainingType: "Balanced Training" });
        });
        sessionStorage.setItem("tailoredTrainingQueue", JSON.stringify(trainingQueue));
        console.log("Training Stats empty. Assigned Balanced Training for all categories:", trainingQueue);
        return;
    }

    Object.keys(trainingStats).forEach(category => {
        let correct = trainingStats[category]?.correct || 0;
        let total = trainingStats[category]?.total || 1;
        let timeTaken = trainingStats[category]?.timeTaken || 999;
        let avgTime = total > 0 ? timeTaken / total : 999;
        let accuracy = (correct / total) * 100;
        let level = playerStats.stats[category]?.level || "Easy";
        let difficultyValue = difficultyRank[level];

        let trainingType;
        if (accuracy < 60) {
            trainingType = "Accuracy Training";
            categorizedTraining.accuracy.push({ category, trainingType, accuracy, avgTime, level, difficultyValue });
        } else if (avgTime > 4) {
            trainingType = "Speed Training";
            categorizedTraining.speed.push({ category, trainingType, accuracy, avgTime, level, difficultyValue });
        } else {
            trainingType = "Balanced Training";
            categorizedTraining.balanced.push({ category, trainingType, accuracy, avgTime, level, difficultyValue });
        }
    });

    // Sorting rules:
    categorizedTraining.accuracy.sort((a, b) => 
        a.difficultyValue - b.difficultyValue || a.accuracy - b.accuracy
    );
    
    categorizedTraining.speed.sort((a, b) => 
        a.difficultyValue - b.difficultyValue || b.avgTime - a.avgTime
    );
    
    categorizedTraining.balanced.sort((a, b) => 
        a.difficultyValue - b.difficultyValue
    );

    // Prioritize accuracy > speed (unless speed is extremely slow)
    categorizedTraining.accuracy.forEach(training => trainingQueue.push(training));
    categorizedTraining.speed.forEach(training => {
        if (training.avgTime > 12) {
            trainingQueue.unshift(training); // Extreme slow speed training gets highest priority
        } else {
            trainingQueue.push(training);
        }
    });
    categorizedTraining.balanced.forEach(training => trainingQueue.push(training));

    sessionStorage.setItem("tailoredTrainingQueue", JSON.stringify(trainingQueue));
    
    console.log("Generated Training Queue (V2):", trainingQueue);

}


async function getNextTrainingQuestions(nextTraining) {
    try {
        if (!nextTraining) {
            console.log("No tailored training provided.");
            return [];
        }

        let response = await fetch("../data/questions.json");
        let allQuestions = await response.json();

        let playerStats = JSON.parse(sessionStorage.getItem("overallTraining")) || {};
        let category = nextTraining.category;
        let currentLevel = playerStats.stats[category]?.level || "Easy";
        let toggleState = localStorage.getItem("toggleState") === "on"; // Retrieve toggle state
        

        let questionLevel;

        if (nextTraining.trainingType === "Speed Training") {
            if (currentLevel == "Difficult") {
                questionLevel = "Medium"; // Lower difficulty for speed training
            } else {
                questionLevel = "Easy";
            }
        } else questionLevel = currentLevel; // Accuracy and Balanced Training

        let filteredQuestions;
        if (toggleState) {
             filteredQuestions = allQuestions.filter(q => q.category === category );
        } else  filteredQuestions = allQuestions.filter(q => q.category === category && q.difficulty === questionLevel);
        let selectedQuestions = getRandomQuestions(filteredQuestions, 10); // Select 10 questions

        console.log(`Next Training: ${nextTraining.trainingType} (${category} at ${questionLevel})`);
        return shuffleArray(selectedQuestions);
    } catch (error) {
        console.error("Error retrieving next training questions:", error);
        return [];
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

function getRandomQuestions(questionArray, num) {
    let shuffled = questionArray.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

function showTrainingGoal(trainingMode) {
    let goalText = "";
    if (trainingMode.trainingType === "Speed Training") {
        goalText = "Focus on answering as fast as possible!";
    } else if (trainingMode.trainingType === "Accuracy Training") {
        goalText = "Try to get as many correct as possible!";
    } else {
        goalText = "Balanced Training: Improve both speed and accuracy!";
    }
    
    document.getElementById("training-goal").innerText = goalText;
}


function displayQuestion(question) {
    // Display the question text along with its difficulty level
    document.getElementById("question-text").innerText = `${question.question} `;
    
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

function checkAnswer(question, selectedOption, buttonElement) {
    let isCorrect = selectedOption === question.answer;

    // ✅ Apply correct/wrong styles
    buttonElement.classList.add(isCorrect ? "correct-answer" : "wrong-answer");
    if (isCorrect) {
            correctQuestions++;
    }

    setTimeout(() => {
        currentIndex++;
        if (currentIndex < questions.length) {
            displayQuestion(questions[currentIndex]);
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
    if (incorrectQuestions.length > 0) {
        document.getElementById("retry-incorrect").style.display = "block"; // ✅ Show Retry button
    }
}