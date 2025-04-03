document.addEventListener("DOMContentLoaded", function() {
    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    let questions = [];

    // Function to fetch questions from the JSON file
    function loadQuestions() {
        fetch('questions.json')  // Assuming the file is in the same directory
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();  // Parse the JSON response
            })
            .then(data => {
                questions = data;  // Store the questions from the JSON
                updateQuestion();  // Update the first question after loading
            })
            .catch(error => {
                console.error('Error loading questions:', error);
                alert('Error loading quiz questions. Please try again later.');
            });
    }

    // Function to update the current question and progress bar
    function updateQuestion() {
        if (questions.length === 0) return;  // If no questions, do nothing

        const currentQuestion = questions[currentQuestionIndex];

        // Display the current question and question number
        document.getElementById('question').textContent = currentQuestion.question;
        document.getElementById('question-number').textContent = currentQuestionIndex + 1;
        document.getElementById('total-questions').textContent = questions.length;

        // Update progress bar
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        document.getElementById('progress').style.width = `${progress}%`;

        // Clear any leftover result message or correct answer display
        document.getElementById('result-message').textContent = '';
        document.getElementById('correct-answer').style.display = 'none';
    }

    // Handle answer submission
    document.getElementById('submit-btn').addEventListener('click', function() {
        const userAnswer = document.getElementById('answer-input').value.trim().toLowerCase();
        const currentQuestion = questions[currentQuestionIndex];

        // Check if the user's answer is correct (case insensitive)
        if (userAnswer === currentQuestion.answer.toLowerCase()) {
            correctAnswers++;
            document.getElementById('result-message').textContent = 'Correct!';
            document.getElementById('result-message').style.color = 'green';
        } else {
            document.getElementById('result-message').textContent = 'Wrong answer!';
            document.getElementById('correct-answer').textContent = `The correct answer is: ${currentQuestion.answer}`;
            document.getElementById('correct-answer').style.display = 'block';
        }

        // Clear the input field for the next question
        document.getElementById('answer-input').value = '';

        // Move to the next question or finish the quiz
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            setTimeout(updateQuestion, 1000);  // Update question after 1 second
        } else {
            setTimeout(showResults, 1000);  // Show results after 1 second
        }
    });

    // Function to show results
    function showResults() {
        // Hide elements related to the quiz
        document.getElementById('question-container').style.display = 'none';
        document.getElementById('answer-input').style.display = 'none';
        document.getElementById('submit-btn').style.display = 'none';
        document.getElementById('progress-container').style.display = 'none';

        // Display the score message based on correct answers
        if (correctAnswers === questions.length) {
            document.getElementById('score-message').textContent = `Congratulations! You answered all questions correctly! 🎉`;
            document.getElementById('celebration').style.display = 'block';  // Show celebration
        } else {
            document.getElementById('score-message').textContent = `You scored ${correctAnswers} out of ${questions.length}`;
        }

        // Show the end screen
        document.getElementById('end-screen').style.display = 'block';
    }

    // Load questions when the page loads
    loadQuestions();
});
