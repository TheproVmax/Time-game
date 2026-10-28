
const questions = [
  {
    question: "On what date did the Great Train Robbery take place?",
    answers: [
      "8 August 1963",
      "8 August 1973",
      "12 October 1963",
      "1 January 1960"
    ],
    correct: 0,
    explanation: "Correct. The robbery took place on 8 August 1963."
  },
  {
    question: "Where did the gang stop the train?",
    answers: [
      "Near London Bridge",
      "Near Bridego Bridge in Buckinghamshire",
      "At a station in Glasgow",
      "Outside Manchester"
    ],
    correct: 1,
    explanation: "Correct. The train was stopped near Bridego Bridge in Buckinghamshire, England."
  },
  {
    question: "Approximately how much money was stolen?",
    answers: [
      "£26,000",
      "£260,000",
      "£2.6 million",
      "£26 million"
    ],
    correct: 2,
    explanation: "Correct. The amount stolen was about £2.6 million at the time."
  },
  {
    question: "What did the gang interfere with to stop the train?",
    answers: [
      "A railway signal",
      "The train's dining car",
      "A bridge support",
      "The station clock"
    ],
    correct: 0,
    explanation: "Correct. The gang tampered with a railway signal to make the train stop."
  },
  {
    question: "Why was Leatherslade Farm important to the investigation?",
    answers: [
      "It was where the train was built",
      "It was the home of the train driver",
      "It was a farmhouse hideout where police found evidence",
      "It was where the money was printed"
    ],
    correct: 2,
    explanation: "Correct. Police discovered the farmhouse hideout and found evidence connected to the gang."
  }
];

const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const feedbackElement = document.getElementById("feedback");
const nextButton = document.getElementById("next-button");
const restartButton = document.getElementById("restart-button");
const gameContent = document.getElementById("game-content");
const gameResults = document.getElementById("game-results");
const progressLabel = document.getElementById("progress-label");
const progressFill = document.getElementById("progress-fill");
const resultTitle = document.getElementById("result-title");
const resultScore = document.getElementById("result-score");
const resultMessage = document.getElementById("result-message");

let currentQuestion = 0;
let score = 0;
let hasAnswered = false;

function showQuestion() {
  hasAnswered = false;

  const question = questions[currentQuestion];

  questionElement.textContent = question.question;
  answersElement.replaceChildren();
  feedbackElement.textContent = "";
  nextButton.hidden = true;

  progressLabel.textContent =
    `QUESTION ${currentQuestion + 1} OF ${questions.length}`;

  progressFill.style.width =
    `${(currentQuestion / questions.length) * 100}%`;

  document.querySelector("#game-content .clue-label").textContent =
    `CLUE ${String(currentQuestion + 1).padStart(2, "0")}`;

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "answer-button";
    button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;

    button.addEventListener("click", () => {
      chooseAnswer(index);
    });

    answersElement.appendChild(button);
  });
}

function chooseAnswer(selectedIndex) {
  if (hasAnswered) return;

  hasAnswered = true;

  const question = questions[currentQuestion];
  const buttons = answersElement.querySelectorAll(".answer-button");
  const isCorrect = selectedIndex === question.correct;

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === question.correct) {
      button.classList.add("correct");
    }

    if (index === selectedIndex && !isCorrect) {
      button.classList.add("incorrect");
    }
  });

  if (isCorrect) {
    score++;
    feedbackElement.textContent = `✓ ${question.explanation}`;
  } else {
    feedbackElement.textContent =
      `✗ Not quite. ${question.explanation}`;
  }

  nextButton.textContent =
    currentQuestion === questions.length - 1
      ? "View case report →"
      : "Next clue →";

  nextButton.hidden = false;
  progressFill.style.width =
    `${((currentQuestion + 1) / questions.length) * 100}%`;
}

function showResults() {
  gameContent.hidden = true;
  gameResults.hidden = false;

  resultScore.textContent = `${score} / ${questions.length} correct`;

  if (score === 5) {
    resultTitle.textContent = "Outstanding detective work.";
    resultMessage.textContent =
      "You caught every detail in the case file. Your historical evidence is solid.";
  } else if (score >= 3) {
    resultTitle.textContent = "A strong investigation.";
    resultMessage.textContent =
      "You uncovered most of the important clues. Review the case notes to sharpen your knowledge.";
  } else {
    resultTitle.textContent = "The case needs another look.";
    resultMessage.textContent =
      "Every detective starts somewhere. Read the facts and timeline, then investigate again.";
  }

  progressLabel.textContent = "CASE REVIEW";
  progressFill.style.width = "100%";
}

function restartGame() {
  currentQuestion = 0;
  score = 0;
  hasAnswered = false;

  gameContent.hidden = false;
  gameResults.hidden = true;

  showQuestion();
}

nextButton.addEventListener("click", () => {
  if (!hasAnswered) return;

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion();
  } else {
    showResults();
  }
});

restartButton.addEventListener("click", restartGame);

showQuestion();
