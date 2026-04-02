const questions = [
  {
    question: "Which language runs natively in the browser?",
    options: ["Python", "Java", "JavaScript", "C++"],
    answer: 2
  },
  {
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Logic", "Home Tool Markup Language"],
    answer: 0
  },
  {
    question: "Which CSS property controls text size?",
    options: ["font-weight", "text-size", "font-size", "letter-spacing"],
    answer: 2
  },
  {
    question: "What does 'DOM' stand for?",
    options: ["Data Object Model", "Document Object Model", "Display Output Mode", "Dynamic Object Method"],
    answer: 1
  },
  {
    question: "Which method adds an element to the end of an array in JavaScript?",
    options: ["push()", "pop()", "shift()", "append()"],
    answer: 0
  },
  {
    question: "What is the correct way to declare a constant in JavaScript?",
    options: ["var x = 5", "let x = 5", "const x = 5", "fixed x = 5"],
    answer: 2
  },
  {
    question: "Which HTTP method is used to send data to a server to create a resource?",
    options: ["GET", "PUT", "DELETE", "POST"],
    answer: 3
  },
  {
    question: "What does CSS stand for?",
    options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Syntax", "Colorful Style Sheets"],
    answer: 1
  },
  {
    question: "Which of these is NOT a JavaScript data type?",
    options: ["String", "Boolean", "Integer", "Undefined"],
    answer: 2
  },
  {
    question: "What does 'async/await' help with in JavaScript?",
    options: ["Styling elements", "Handling asynchronous code", "Declaring variables", "Creating classes"],
    answer: 1
  }
];

let currentIndex = 0;
let score = 0;
let timerInterval = null;
let timeLeft = 15;
let answered = false;
let results = []; // track per-question result

const labels = ['A', 'B', 'C', 'D'];

function startQuiz() {
  currentIndex = 0;
  score = 0;
  results = [];
  showScreen('quiz-screen');
  loadQuestion();
}

function loadQuestion() {
  answered = false;
  timeLeft = 15;

  const q = questions[currentIndex];

  // Progress bar
  document.getElementById('progress-fill').style.width =
    ((currentIndex / questions.length) * 100) + '%';

  // Meta
  document.getElementById('question-count').textContent =
    `Question ${currentIndex + 1} of ${questions.length}`;

  // Question
  document.getElementById('question-text').textContent = q.question;

  // Options
  const list = document.getElementById('options-list');
  list.innerHTML = '';
  q.options.forEach((opt, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <button class="option-btn" onclick="selectAnswer(${i})">
        <span class="option-label">${labels[i]}</span>
        ${opt}
      </button>
    `;
    list.appendChild(li);
  });

  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 5) {
      document.getElementById('timer').classList.add('urgent');
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (!answered) timeOut();
    }
  }, 1000);
}

function updateTimerDisplay() {
  document.getElementById('timer').textContent = `⏱ ${timeLeft}`;
}

function timeOut() {
  answered = true;
  // Highlight correct answer
  const buttons = document.querySelectorAll('.option-btn');
  buttons[questions[currentIndex].answer].classList.add('correct');
  buttons.forEach(btn => btn.disabled = true);

  results.push({ question: questions[currentIndex].question, correct: false });

  setTimeout(nextQuestion, 1200);
}

function selectAnswer(index) {
  if (answered) return;
  answered = true;
  clearInterval(timerInterval);

  const correct = questions[currentIndex].answer;
  const buttons = document.querySelectorAll('.option-btn');

  buttons.forEach(btn => btn.disabled = true);

  if (index === correct) {
    buttons[index].classList.add('correct');
    score++;
    results.push({ question: questions[currentIndex].question, correct: true });
  } else {
    buttons[index].classList.add('wrong');
    buttons[correct].classList.add('correct');
    results.push({ question: questions[currentIndex].question, correct: false });
  }

  setTimeout(nextQuestion, 1200);
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  showScreen('result-screen');

  // Progress bar to 100%
  document.getElementById('progress-fill').style.width = '100%';

  document.getElementById('score-number').textContent = score;

  // Emoji + message based on score
  let emoji, title, subtitle;
  if (score === 10)      { emoji = '🏆'; title = 'Perfect Score!';     subtitle = 'You nailed every single question!'; }
  else if (score >= 8)   { emoji = '🎉'; title = 'Excellent!';          subtitle = 'You really know your stuff.'; }
  else if (score >= 6)   { emoji = '👍'; title = 'Good Job!';           subtitle = 'A bit more practice and you\'ll ace it.'; }
  else if (score >= 4)   { emoji = '📚'; title = 'Keep Studying!';      subtitle = 'Review the topics and try again.'; }
  else                   { emoji = '💪'; title = 'Don\'t Give Up!';     subtitle = 'Every expert was once a beginner.'; }

  document.getElementById('score-emoji').textContent = emoji;
  document.getElementById('score-title').textContent = title;
  document.getElementById('score-subtitle').textContent = subtitle;

  // Breakdown
  const breakdown = document.getElementById('result-breakdown');
  breakdown.innerHTML = '';
  results.forEach((r, i) => {
    const div = document.createElement('div');
    div.className = 'breakdown-item';
    div.innerHTML = `
      <span class="icon">${r.correct ? '✅' : '❌'}</span>
      <span>Q${i + 1}: ${r.question}</span>
    `;
    breakdown.appendChild(div);
  });
}

function restartQuiz() {
  showScreen('start-screen');
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}