document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");

  // This event listener checks if the user has scrolled more than 10px
  // If yes, it adds the 'scrolled' class to the header (for styling changes like shrinking)
  // If not, it removes the 'scrolled' class
  window.addEventListener("scroll", function () {
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
});

// Object to store references to different topic sections by their IDs
let topicElements = {
  aim: document.getElementById("aim"),
  theory: document.getElementById("theory"),
  procedure: document.getElementById("procedure"),
  practice: document.getElementById("practice"),
  code: document.getElementById("code"),
  result: document.getElementById("result"),
  quiz: document.getElementById("quiz"),
  references: document.getElementById("references"),
  tnt: document.getElementById("tnt"),
};

let currentTopic = "aim"; // Track the currently displayed topic
function switchContent(topic) {
    if (topic === currentTopic) {
        return; // Prevent unnecessary updates if the same topic is clicked again
    }

    topicElements[currentTopic].style.display = 'none'; // Hide the previous topic
    topicElements[topic].style.display = 'block'; // Show the selected topic
    currentTopic = topic; // Update the current topic
}

// Generalized function to toggle language-based code blocks
function toggleCode(language) {
  const allCodeBlocks = document.querySelectorAll(".code-block");
  allCodeBlocks.forEach((block) => block.classList.remove("active"));

  const selectedCodeBlock = document.getElementById(language + "Code");
  selectedCodeBlock.classList.add("active");
}

// Clipboard copy function
function copyCode(elementId) {
  const codeBlock = document.getElementById(elementId);
  const code = codeBlock.querySelector("code").innerText;

  // Copy the selected code text to clipboard
  navigator.clipboard
    .writeText(code)
    .then(() => {
      const copyButton = codeBlock.querySelector(".copy-button");
      copyButton.textContent = "Copied!"; // Temporarily change button text
      setTimeout(() => {
        copyButton.textContent = "Copy"; // Reset text after 2 seconds
      }, 2000);
    })
    .catch((err) => {
      console.error("Could not copy text: ", err);
    });
}

// Event listeners for radio buttons
document
  .getElementById("cppRadio")
  .addEventListener("change", () => toggleCode("cpp"));
document
  .getElementById("pythonRadio")
  .addEventListener("change", () => toggleCode("python"));

// Event listener for copy buttons
document.querySelectorAll(".copy-button").forEach((button) => {
  button.addEventListener("click", function () {
    const language = button.closest(".code-block").id.replace("Code", "");
    copyCode(language + "Code");
  });
});

// Quiz Logic
const questions = [
  {
    question: " Q1) What data structure is used to represent a 2D matrix in Python?",
    choices: [" List of lists", "Dictionary", " Tuple", " Set"],
    correctAnswers: [0],
  },
  {
    question: " Q2) How do you create a 3×3 matrix filled with zeros?",
    choices: ["matrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]", " matrix = [[0] * 3] * 3", "matrix = [[0 for _ in range(3)] for _ in range(3)]", "Both (a) and (c)"],
    correctAnswers: [3],
  },
  {
    question: " Q3) How do you access the element in the second row, third column of matrix?(Note: Matrix indices starts from 0.",
    choices: ["  matrix[1][2]", " matrix[2][3]", "  matrix(1,2)", " matrix[2,3] "],
    correctAnswers: [0],
  },
  
  {
    question: " Q4) What will this code output? matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]   print(matrix[0])",
    choices: ["  [1, 2, 3]", "[4, 5, 6]", " [7, 8, 9]", " 1"],
    correctAnswers: [0],
  },
  {
    question: " Q5) What is the output of this Python snippet?  matrix = [[0] * 3] * 3 ; matrix[0][0] = 1; print(matrix)",
    choices: [" [[1, 0, 0], [0, 0, 0], [0, 0, 0]]", " [[1, 0, 0], [1, 0, 0], [1, 0, 0]]", " [[1, 1, 1], [1, 1, 1], [1, 1, 1]]", " Error"],
    correctAnswers: [1],
  },
  {
    question: " Q6) How do you find the number of rows in a 2D matrix matrix?",
    choices: [" len(matrix[0])","len(matrix)", " matrix.shape[0]", "  matrix.rows"],
    correctAnswers: [1],
  },
];

let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

const questionElement = document.getElementById("question");
const choicesContainer = document.getElementById("choices");
const nextButton = document.getElementById("next-btn");
const retakeButton = document.getElementById("retake-btn");
const quizReport = document.getElementById("quiz-report");

function showQuestion() {
  const q = questions[currentQuestionIndex];
  questionElement.textContent = q.question;
  choicesContainer.innerHTML = "";

  q.choices.forEach((choice, i) => {
    const button = document.createElement("button");
    button.textContent = choice;
    button.classList.add("choice");
    button.addEventListener("click", () => toggleSelection(i));
    choicesContainer.appendChild(button);
  });

  nextButton.style.display = "block";
  retakeButton.style.display = "none";
}

function toggleSelection(selectedIndex) {
  if (!userAnswers[currentQuestionIndex]) userAnswers[currentQuestionIndex] = [];

  const selected = userAnswers[currentQuestionIndex];
  const idx = selected.indexOf(selectedIndex);
  if (idx > -1) {
    selected.splice(idx, 1);
  } else {
    selected.push(selectedIndex);
  }

  document.querySelectorAll(".choice").forEach((btn, i) => {
    if (selected.includes(i)) {
      btn.style.backgroundColor = "#4285F4";
      btn.style.color = "white";
    } else {
      btn.style.backgroundColor = "#f1f1f1";
      btn.style.color = "black";
    }
  });
}

function checkAnswer() {
  const correct = questions[currentQuestionIndex].correctAnswers;
  const selected = userAnswers[currentQuestionIndex] || [];

  if (arraysEqual(correct, selected)) score++;

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((v, i) => b.includes(v));
}

function showResults() {
  questionElement.textContent = `Quiz Completed! Your Score: ${score} / ${questions.length}`;
  choicesContainer.innerHTML = "";
  nextButton.style.display = "none";
  retakeButton.style.display = "block";
  displayQuizReport();
}

function displayQuizReport() {
  quizReport.style.display = "block";
  quizReport.innerHTML = "<h3>Quiz Report</h3>";

  questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "quiz-report-question";

    const p = document.createElement("p");
    p.textContent = q.question;
    div.appendChild(p);

    const ul = document.createElement("ul");
    q.choices.forEach((choice, j) => {
      const li = document.createElement("li");
      li.textContent = choice;
      if ((userAnswers[i] || []).includes(j)) {
        li.style.backgroundColor = q.correctAnswers.includes(j) ? "green" : "red";
        li.style.color = "white";
      }
      ul.appendChild(li);
    });
    div.appendChild(ul);
    quizReport.appendChild(div);
  });
}

retakeButton.addEventListener("click", () => {
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  quizReport.style.display = "none";
  showQuestion();
});

nextButton.addEventListener("click", checkAnswer);

showQuestion();
console.log("script loaded");

document.addEventListener("DOMContentLoaded", () => {
  if (window.hljs && typeof hljs.highlightAll === "function") {
    try {
      hljs.highlightAll();
    } catch (e) {
      console.warn("hljs.highlightAll() failed:", e);
    }
  } else {
    console.warn("highlight.js (hljs) not found on window.");
  }
});