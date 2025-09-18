let nextIndex = 0;
let elementList = [];
let row, column;
let matrix = []; // 2D representation for traversal & manipulation
let matrixDiv, messageP, MatrixNextButton, MatrixResetButton, explanationP;

// Predefined range for random matrix generation
const MIN_VALUE = 1;
const MAX_VALUE = 50;

// Buttons & Inputs
const manualBtn = document.getElementById("manualBtn");
const randomBtn = document.getElementById("randomBtn");
const elementsInput = document.getElementById("elementsInput");
const rowInput = document.getElementById("row");
const colInput = document.getElementById("column");
const enterBtn = document.getElementById("enterBtn");
const resetButton = document.getElementById("resetButton");
const goToTraversalBtn = document.getElementById("goToTraversalBtn");

// Steps
let currentStep = 0;
const stepExplanation = document.getElementById("stepExplanation");
const stepNextBtn = document.getElementById("stepNextBtn");
const creationStep = document.getElementById("creationStep");
const matrixSteps = document.getElementById("matrixSteps");
const traversalStep = document.getElementById("traversalStep");
const manipulationStep = document.getElementById("manipulationStep");

// Traversal elements
const traversalMatrixContainer = document.getElementById("traversalMatrixContainer");
const traversalExplanation = document.getElementById("traversalExplanation");
const traversalNextBtn = document.getElementById("traversalNextBtn");
const traverseRow = document.getElementById("traverseRow");
const traverseCol = document.getElementById("traverseCol");
const traverseBtn = document.getElementById("traverseBtn");
const traversalResetBtn = document.getElementById("traversalResetBtn");


// Manipulation elements
const manipulationMatrixContainer = document.getElementById("manipulationMatrixContainer");
const manipulationExplanation = document.getElementById("manipulationExplanation");
const manipulationResetBtn = document.getElementById("manipulationResetBtn");
const manipulateRow = document.getElementById("manipulateRow");
const manipulateCol = document.getElementById("manipulateCol");
const newValue = document.getElementById("newValue");
const manipulateBtn = document.getElementById("manipulateBtn");

// Helpers
function hideEnterButton() {
  enterBtn.classList.add('hidden');
}
function showEnterButton() {
  enterBtn.classList.remove('hidden');
}

// Mode selection
// Hide ENTER initially
enterBtn.style.display = "none";

manualBtn.addEventListener("click", () => {
  elementsInput.style.display = "block";
  enterBtn.style.display = "inline-block"; // show ENTER
});

randomBtn.addEventListener("click", () => {
  elementsInput.style.display = "none";
  enterBtn.style.display = "none"; // hide ENTER
  generateRandomMatrix();
});

// Step Flow
stepNextBtn.textContent = "Step 1 → Creation";
stepNextBtn.addEventListener("click", () => {
  currentStep++;

  if (currentStep === 1) {
    // Step 1: Creation
    matrixSteps.style.display = "none";
    creationStep.style.display = "block";
    stepNextBtn.style.display = "none"; // hidden until creation finishes
  } else if (currentStep === 2) {
    // Step 2: Traversal
    creationStep.style.display = "none";
    traversalStep.style.display = "block";
    displayMatrix(matrix, traversalMatrixContainer);
    stepNextBtn.textContent = "Step 3 → Manipulation";
  } else if (currentStep === 3) {
    // Step 3: Manipulation
    traversalStep.style.display = "none";
    manipulationStep.style.display = "block";
    displayMatrix(matrix, manipulationMatrixContainer);
    stepNextBtn.style.display = "none"; // hide at last step
  }
});

// Display matrix manually
function display() {
  row = parseInt(rowInput.value);
  column = parseInt(colInput.value);
  let values = document.getElementById("values").value;

  const matrixContainer = document.getElementById("matrixContainer");
  matrixContainer.innerHTML = "";

  if (isNaN(row) || isNaN(column) || values.trim() === "") {
    matrixContainer.innerHTML = `<p class="message" style="color: red;">Please enter valid numbers and elements!</p>`;
    return;
  }

  let elementListRaw = values.split(",").map(num => num.trim());
  if (elementListRaw.some(v => v === "" || isNaN(parseFloat(v)))) {
    matrixContainer.innerHTML = `<p class="message" style="color: red;">Please enter only numbers separated by commas!</p>`;
    return;
  }

  elementList = elementListRaw.map(num => parseFloat(num));
  nextIndex = 0;

  const requiredElements = row * column;
  if (elementList.length !== requiredElements) {
    matrixContainer.innerHTML = `<p class="message" style="color: red;">Need exactly ${requiredElements} elements!</p>`;
    return;
  }

  hideEnterButton();
  resetButton.classList.remove("hidden");
  createMatrixGrid();
}

// Random matrix
function generateRandomMatrix() {
  row = parseInt(rowInput.value);
  column = parseInt(colInput.value);

  const matrixContainer = document.getElementById("matrixContainer");
  matrixContainer.innerHTML = "";

  if (isNaN(row) || isNaN(column) || row <= 0 || column <= 0) {
    matrixContainer.innerHTML = `<p class="message" style="color: red;">Enter valid rows & columns!</p>`;
    return;
  }

  elementList = [];
  for (let i = 0; i < row * column; i++) {
    elementList.push(Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE);
  }

  nextIndex = 0;
  hideEnterButton();
  createMatrixGrid();
}

// Create grid
function createMatrixGrid() {
  const matrixContainer = document.getElementById("matrixContainer");
  matrixContainer.innerHTML = "";

  matrixDiv = document.createElement("div");
  matrixDiv.className = "matrix-container";

  const grid = document.createElement("div");
  grid.className = "matrix-grid";
  grid.style.gridTemplateColumns = `repeat(${column}, 50px)`;

  for (let i = 0; i < row * column; i++) {
    const cell = document.createElement("div");
    cell.className = "cell empty";
    cell.textContent = "_";
    grid.appendChild(cell);
  }

  matrixDiv.appendChild(grid);
  matrixContainer.appendChild(matrixDiv);

  messageP = document.createElement("p");
  messageP.className = "message";
  matrixDiv.appendChild(messageP);

  explanationP = document.createElement("p");
  explanationP.className = "explanation";
  explanationP.textContent = "Step-by-step explanation will appear here.";
  matrixDiv.appendChild(explanationP);

  MatrixNextButton = document.createElement("button");
  MatrixNextButton.textContent = "Next";
  MatrixNextButton.onclick = () => insertNextValue(grid);
  matrixDiv.appendChild(MatrixNextButton);

  resetButton.classList.remove("hidden");
  goToTraversalBtn.classList.remove("hidden");

  // Reset 2D array
  matrix = Array.from({ length: row }, () => Array(column).fill(null));
}

// Fill matrix one cell at a time
function insertNextValue(grid) {
  if (nextIndex < row * column) {
    const insertedValue = elementList[nextIndex];
    const cell = grid.children[nextIndex];
    cell.textContent = insertedValue;
    cell.classList.remove("empty");
    cell.classList.add("filled");

    const r = Math.floor(nextIndex / column);
    const c = nextIndex % column;
    matrix[r][c] = insertedValue;

    explanationP.textContent = `Step ${nextIndex + 1}: Added ${insertedValue} at (Row ${r + 1}, Col ${c + 1})`;
    nextIndex++;
  }

  if (nextIndex === row * column) {
    explanationP.textContent = "Matrix is now completely filled!";
    messageP.textContent = "All elements are filled!";
    MatrixNextButton.style.display = "none";

    // Show step progression
    stepNextBtn.style.display = "block";
    stepNextBtn.textContent = "Step 2 → Traversal";
  }
}

// Reset
function resetMatrix() {
  rowInput.value = "";
  colInput.value = "";
  document.getElementById("values").value = "";
  document.getElementById("matrixContainer").innerHTML = "";
  resetButton.classList.add("hidden");
  elementsInput.style.display = "none";
  nextIndex = 0;
  elementList = [];
  matrix = [];
  showEnterButton();
}

goToTraversalBtn.addEventListener("click", () => {
  creationStep.style.display = "none";
  traversalStep.style.display = "block";
  displayMatrix(matrix, traversalMatrixContainer);
  traversalExplanation.textContent = "Enter row and column to see the value.";
});

// Traversal
traverseBtn.addEventListener("click", () => {
  let r = parseInt(traverseRow.value);
  let c = parseInt(traverseCol.value);
  clearHighlights(traversalMatrixContainer);

  if (isNaN(r) || isNaN(c) || r < 0 || r >= row || c < 0 || c >= column) {
    traversalExplanation.textContent = "Invalid indices.";
    return;
  }

  traversalExplanation.textContent = `Value at [${r}][${c}] is ${matrix[r][c]}.`;
  highlightCell(traversalMatrixContainer, r, c);

  // ✅ Show buttons only after a valid traversal
  traversalNextBtn.classList.remove("hidden");
  traversalResetBtn.classList.remove("hidden");
});



traversalResetBtn.addEventListener("click", () => {
  clearHighlights(traversalMatrixContainer);
  traversalExplanation.textContent = "";
  traverseRow.value = "";
  traverseCol.value = "";

  // ✅ Hide reset until another traversal happens
  traversalResetBtn.classList.add("hidden");
});




traversalNextBtn.addEventListener("click", () => {
  traversalStep.style.display = "none";
  manipulationStep.style.display = "block";
  displayMatrix(matrix, manipulationMatrixContainer);
});

// Manipulation
manipulateBtn.addEventListener("click", () => {
  let r = parseInt(manipulateRow.value);
  let c = parseInt(manipulateCol.value);
  let val = parseInt(newValue.value);
  clearHighlights(manipulationMatrixContainer);

  if (isNaN(r) || isNaN(c) || isNaN(val) || r < 0 || r >= row || c < 0 || c >= column) {
    manipulationExplanation.textContent = "Invalid input.";
    return;
  }

  matrix[r][c] = val;
  manipulationExplanation.textContent = `Matrix updated at [${r}][${c}].`;
  displayMatrix(matrix, manipulationMatrixContainer);
  highlightCell(manipulationMatrixContainer, r, c);
});

manipulationResetBtn.addEventListener("click", () => {
  // Clear input fields
  manipulateRow.value = "";
  manipulateCol.value = "";
  newValue.value = "";

  // Clear highlights
  clearHighlights(manipulationMatrixContainer);

  // Reset explanation text
  manipulationExplanation.textContent = "Enter index to update and new value:";

  // Redisplay the current matrix without changes
  displayMatrix(matrix, manipulationMatrixContainer);
});

// Helpers for traversal/manipulation
function displayMatrix(matrixData, container) {
  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${column}, 50px)`;
  container.className = "matrix-grid";

  matrixData.forEach((rowArr, rIdx) => {
    rowArr.forEach((val, cIdx) => {
      let cell = document.createElement("div");
      cell.className = "matrix-cell";
      cell.textContent = val;
      cell.dataset.row = rIdx;
      cell.dataset.col = cIdx;
      container.appendChild(cell);
    });
  });
}

function highlightCell(container, r, c) {
  let cells = container.querySelectorAll(".matrix-cell");
  cells.forEach(cell => {
    if (parseInt(cell.dataset.row) === r && parseInt(cell.dataset.col) === c) {
      cell.classList.add("highlight");
    }
  });
}

function clearHighlights(container) {
  container.querySelectorAll(".matrix-cell").forEach(cell => {
    cell.classList.remove("highlight");
  });
}
