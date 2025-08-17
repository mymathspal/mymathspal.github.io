// Quiz Game Core Variables
let riddles = [];              // Stores selected questions for the current game
let allRiddles = [];           // Full set of available questions loaded from JSON
let currentQuestion = 0;       // Index of the current question
let currentClueIndex = 0;      // Tracks how many clues have been shown
let score = 0;                 // Total user score
let questionScore = 5;         // Max score per question, decreases with clues
let timer;                     // Timer reference for countdown
let timerDuration = 25;        // Initial duration for each question

// Get Topic from URL
function getTopicFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("topic");
}

// Initialize on Page Load
document.addEventListener("DOMContentLoaded", () => {
  // Attach event listeners to buttons
  document.getElementById("startBtn").addEventListener("click", startQuiz);
  document.getElementById("addClueBtn").addEventListener("click", addClue);
  document.getElementById("openAnswerOverlayBtn").addEventListener("click", showChoices);

  // Load topic from URL
  const topic = getTopicFromURL();
  if (!topic) return alert("No topic selected.");

  // Fetch quiz data from JSON
  fetch(`../quiz-questions/questions/${topic}.json`)
    .then(res => res.json())
    .then(data => {
      allRiddles = data;
      riddles = [...allRiddles];
      document.querySelector(".title").textContent = topic.toUpperCase();

      // Populate number of questions dropdown (in 5s)
      const select = document.getElementById("numQuestionsSelect");
      const total = allRiddles.length;
      select.innerHTML = "";

      for (let i = 5; i <= total; i += 5) {
        select.innerHTML += `<option value="${i}">${i}</option>`;
      }

      if (total % 5 !== 0) {
        select.innerHTML += `<option value="${total}">${total}</option>`;
      }
    })
    .catch(() => alert("Failed to load quiz questions. Please try again later."));
});

// Start Quiz
function startQuiz() {
  const numQuestions = parseInt(document.getElementById("numQuestionsSelect").value);
  riddles = [...allRiddles];
  shuffleArray(riddles);              // Randomize question order
  riddles = riddles.slice(0, numQuestions);

  currentQuestion = 0;
  score = 0;

  document.getElementById("rulesOverlay").classList.add("hidden"); // Hide rules
  document.getElementById("nsmqAudio").play();                     // Start background sound
  loadQuestion();
}


// Load Current Question
function loadQuestion() {
  questionScore = 5;
  timerDuration = 25;
  startTimer();

  const questionBox = document.getElementById("questionBox");
  questionBox.innerHTML = "";
  currentClueIndex = 0;
  const clues = riddles[currentQuestion].clue;

  // Show first 3 clues initially
  for (let i = 0; i < 3 && i < clues.length; i++) {
    questionBox.innerHTML += `<p class="clue"><span class="clue-num">Clue ${i + 1}:</span> ${clues[i]}</p>`;
    currentClueIndex++;
  }

  document.querySelector(".fnum").textContent = currentQuestion + 1;
  document.querySelector(".snum").textContent = riddles.length;
  updateAddClueBtn();
}

// Start Countdown Timer
function startTimer() {
  clearInterval(timer);
  document.getElementById("timer").textContent = timerDuration;
  timer = setInterval(() => {
    timerDuration--;
    document.getElementById("timer").textContent = timerDuration;
    if (timerDuration <= 0) {
      clearInterval(timer);
      autoSubmit(); // Auto-submit when time runs out
    }
  }, 1000);
}


// Shuffle Array (Fisher–Yates)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Show/Disable "Add Clue" Button
function updateAddClueBtn() {
  const clues = riddles[currentQuestion].clue;
  const btn = document.getElementById("addClueBtn");
  btn.textContent = currentClueIndex >= clues.length ? "NO CLUE LEFT" : `ADD CLUE ${currentClueIndex + 1}`;
  btn.disabled = currentClueIndex >= clues.length;
}

// Add Another Clue
function addClue() {
  const clues = riddles[currentQuestion].clue;
  if (currentClueIndex < clues.length) {
    document.getElementById("questionBox").innerHTML += `<p class="clue"><span class="clue-num">Clue ${currentClueIndex + 1}:</span> ${clues[currentClueIndex]}</p>`;
    currentClueIndex++;
    if (currentClueIndex > 3) questionScore = Math.max(0, questionScore - 1);
    updateAddClueBtn();
  }
}


// Show Answer Choices
function showChoices() {
  const container = document.getElementById("choicesContainer");
  container.innerHTML = "";

  const choices = [...riddles[currentQuestion].choices];
  shuffleArray(choices); // Randomize order of options

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice;
    btn.onclick = () => handleChoice(choice);
    container.appendChild(btn);
  });

  document.getElementById("choiceOverlay").classList.remove("hidden");
}

// Handle Option Click
function handleChoice(choice) {
  document.getElementById("choiceOverlay").classList.add("hidden");
  submitAnswer(choice);
}


// Submit Answer
function submitAnswer(selected) {
  clearInterval(timer);

  const correct = riddles[currentQuestion].answer.toUpperCase();
  const user = selected ? selected.toUpperCase() : "";
  const overlay = document.getElementById("feedbackOverlay");
  const message = document.getElementById("feedbackMessage");

  const isCorrect = user === correct;
  document.getElementById(isCorrect ? "correctSound" : "wrongSound").play();

  message.textContent = isCorrect ? "Correct! Well done." : `Wrong! The correct answer was: ${correct}`;
  overlay.classList.toggle("correct", isCorrect);
  overlay.classList.toggle("wrong", !isCorrect);
  overlay.classList.remove("hidden");

  if (isCorrect) score += questionScore;
}

// Auto-Submit on Timeout
function autoSubmit() {
  document.getElementById("addClueBtn").disabled = true;
  const correct = riddles[currentQuestion].answer.toUpperCase();
  const overlay = document.getElementById("feedbackOverlay");
  const message = document.getElementById("feedbackMessage");

  document.getElementById("wrongSound").play();
  message.textContent = `Time's up! The correct answer was: ${correct}`;
  overlay.classList.add("wrong");
  overlay.classList.remove("correct");
  overlay.classList.remove("hidden");
}


// Move to Next Question
function nextQuestion() {
  currentQuestion++;
  document.getElementById("feedbackOverlay").classList.add("hidden");
  document.getElementById("addClueBtn").disabled = false;

  if (currentQuestion < riddles.length) {
    loadQuestion();
  } else {
    showFinalScore();
  }
}

// Show Final Score & Options
function showFinalScore() {
  const overlay = document.getElementById("feedbackOverlay");
  const message = document.getElementById("feedbackMessage");
  const endSound = document.getElementById("endSound");

  endSound.currentTime = 0;
  endSound.play();

  message.innerHTML = `Quiz Completed!<br>Your score is <strong>${score}</strong> out of <strong>${riddles.length * 5}</strong>.`;
  overlay.classList.remove("hidden");

  // Hide next button, show end options
  document.getElementById("nextBtn").style.display = "none";
  const endButtons = document.getElementById("endButtons");
  endButtons.style.display = "flex";
  endButtons.style.flexDirection = "column";
  endButtons.style.gap = "12px";

  const addClueBtn = document.getElementById("addClueBtn");
  addClueBtn.disabled = true;
  addClueBtn.style.display = "none";

  // Reset background sound
  const audio = document.getElementById("nsmqAudio");
  audio.pause();
  audio.currentTime = 0;

  overlay.classList.remove("correct", "wrong");
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
}

// Restart the Quiz
function restartQuiz() {
  clearInterval(timer);
  score = 0;
  currentQuestion = 0;
  currentClueIndex = 0;

  const overlay = document.getElementById("feedbackOverlay");
  overlay.classList.add("hidden");
  overlay.classList.remove("correct", "wrong");
  overlay.style.backgroundColor = "";

  document.getElementById("nextBtn").style.display = "inline-block";
  document.getElementById("endButtons").style.display = "none";

  const addClueBtn = document.getElementById("addClueBtn");
  addClueBtn.disabled = false;
  addClueBtn.style.display = "inline-block";
  addClueBtn.textContent = "ADD CLUE 1";

  startQuiz(); // Restart from beginning
}