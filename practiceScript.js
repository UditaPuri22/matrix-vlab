let nextIndex = 0;
let elementList = [];
let row, column;
let matrix = []; // 2D representation for traversal & manipulation
let matrixDiv, messageP, MatrixNextButton, MatrixResetButton, explanationP;

// Predefined range for random matrix generation
const MAX_SIZE = 8;
const MIN_VALUE = 1;
const MAX_VALUE = 50;
const matrixContainer = document.getElementById("matrixContainer");
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
const transposeStep = document.getElementById("transposeStep");
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

// Transpose
const transposeOriginalContainer = document.getElementById("transposeOriginalContainer");
const transposeMatrixContainer = document.getElementById("transposeMatrixContainer");
const transposeExplanation = document.getElementById("transposeExplanation");
const transposeBtn = document.getElementById("transposeBtn");
const transposeResetBtn = document.getElementById("transposeResetBtn");
const goToTransposeBtn = document.getElementById("goToTransposeBtn");
const transposeTitle = document.getElementById("transposeTitle");

// Helpers
function hideEnterButton() {
  enterBtn.classList.add('hidden');
}
function showEnterButton() {
  enterBtn.classList.remove('hidden');
}
function showInvalid(inputElement, message, targetContainer = null) {
  inputElement.value = "";
  inputElement.focus();

  if (targetContainer) {
    targetContainer.textContent = message;
    targetContainer.style.color = "red";
  } else {
    const error = document.createElement("p");
    error.className = "message";
    error.style.color = "red";
    error.innerText = message;

    matrixContainer.innerHTML = "";
    matrixContainer.appendChild(error);
  }
}

function validateMatrixSize() {

  row = parseInt(rowInput.value);
  column = parseInt(colInput.value);

  // Row empty
  if (rowInput.value.trim() === "") {
    showInvalid(rowInput, "Row cannot be empty.");
    return false;
  }

  // Row integer
  if (!Number.isInteger(Number(rowInput.value)) || row <= 0) {
    showInvalid(rowInput, "Row must be a positive whole number.");
    return false;
  }

  // Maximum row
  if (row > MAX_SIZE) {
    showInvalid(rowInput, `Maximum allowed rows is ${MAX_SIZE}.`);
    return false;
  }

  // Column empty
  if (colInput.value.trim() === "") {
    showInvalid(colInput, "Column cannot be empty.");
    return false;
  }

  // Column integer
  if (!Number.isInteger(Number(colInput.value)) || column <= 0) {
    showInvalid(colInput, "Column must be a positive whole number.");
    return false;
  }

  // Maximum column
  if (column > MAX_SIZE) {
    showInvalid(colInput, `Maximum allowed columns is ${MAX_SIZE}.`);
    return false;
  }

  return true;
}


// Mode selection
// Hide ENTER initially
enterBtn.style.display = "none";

manualBtn.addEventListener("click", () => {

  if (!validateMatrixSize()) return;

  elementsInput.style.display = "block";
  enterBtn.style.display = "inline-block";

});

randomBtn.addEventListener("click", () => {

  if (!validateMatrixSize()) return;

  elementsInput.style.display = "none";
  enterBtn.style.display = "none";

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
  if (!validateMatrixSize()) return;
  matrixContainer.innerHTML = "";

  if (rowInput.value.trim() === "") {
    showInvalid(rowInput, "Row cannot be empty.");
    return;
  }

  if (!Number.isInteger(Number(rowInput.value)) || row <= 0) {
    showInvalid(rowInput, "Row must be a positive whole number.");
    return;
  }

  if (row > MAX_SIZE) {
    showInvalid(rowInput, `Maximum allowed rows is ${MAX_SIZE}.`, null);
    return;
  }

  if (colInput.value.trim() === "") {
    showInvalid(colInput, "Column cannot be empty.");
    return;
  }

  if (!Number.isInteger(Number(colInput.value)) || column <= 0) {
    showInvalid(colInput, "Column must be a positive whole number.");
    return;
  }

  if (column > MAX_SIZE) {
    showInvalid(colInput, `Maximum allowed columns is ${MAX_SIZE}.`, null);
    return;
  }

  // 🔹 Values validation
  if (values === "") {
    showInvalid(document.getElementById("values"), "Please enter matrix values.");
    return;
  }

  let elementListRaw = values.split(",").map(num => num.trim());
  if (elementListRaw.some(v => v === "" || !Number.isInteger(Number(v)))) {
    showInvalid(document.getElementById("values"),
      "Only whole numbers are allowed. Decimals and negatives are not permitted.");
    return;
  }


  if (elementListRaw.some(v => Number(v) < 0)) {
    showInvalid(document.getElementById("values"),
      "Negative numbers are not allowed.");
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


  matrixContainer.innerHTML = "";


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
  const btnWrapper = document.createElement("div");
  btnWrapper.className = "button-practice";
  btnWrapper.appendChild(MatrixNextButton);

  matrixDiv.appendChild(btnWrapper);

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
    
    explanationP.innerHTML = `
<div style="background:#f8fbff;
border-left:5px solid #3b82f6;
padding:15px;
margin-top:15px;
border-radius:8px;
text-align:left;
line-height:1.8;">

<b>Matrix Size:</b> ${row} × ${column}<br><br>
A matrix is created by arranging values into
<b>${row}</b> row(s) and
<b>${column}</b> column(s).
<hr>
✔ Total Rows : <b>${row}</b><br>
✔ Total Columns : <b>${column}</b><br>
✔ Total Elements : <b>${row*column}</b><br><br>
✔ Every element is uniquely identified by its row and column index.
</div>
`;
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

  // Check whole number first
  if (!Number.isInteger(Number(traverseRow.value))) {
    showInvalid(traverseRow, "Row index must be a whole number.", traversalExplanation);
    return;
  }

  if (!Number.isInteger(Number(traverseCol.value))) {
    showInvalid(traverseCol, "Column index must be a whole number.", traversalExplanation);
    return;
  }

  // Negative check
  if (r < 0) {
    showInvalid(traverseRow, "Row index cannot be negative. Indexing starts from 0.", traversalExplanation);
    return;
  }

  if (c < 0) {
    showInvalid(traverseCol, "Column index cannot be negative. Indexing starts from 0.", traversalExplanation);
    return;
  }

  // Large index check with reason
  if (r >= row) {
    showInvalid(
      traverseRow,
      `Invalid row index. Matrix has ${row} rows, so maximum allowed index is ${row - 1}.`,
      traversalExplanation
    );
    return;
  }

  if (c >= column) {
    showInvalid(
      traverseCol,
      `Invalid column index. Matrix has ${column} columns, so maximum allowed index is ${column - 1}.`,
      traversalExplanation
    );
    return;
  }



 traversalExplanation.innerHTML = `
<div style="background:#f8fbff;
border-left:5px solid #3b82f6;
padding:15px;
margin-top:15px;
border-radius:8px;
text-align:left;
line-height:1.8;">
<b>Selected Position :</b>
(${r}, ${c})<br>
<b>Element Found :</b>
${matrix[r][c]}
<hr>
Traversal means visiting matrix elements one by one.
The highlighted element is located using its
<b>row index</b> and
<b>column index</b>.
<p style="color:#15803d;font-weight:bold;">
Every matrix element can be accessed uniquely using its row and column indices.
</p>

</div>
`;
  highlightCell(traversalMatrixContainer, r, c);

  // ✅ Show buttons only after a valid traversal
  traverseBtn.classList.add("hidden");
  traversalNextBtn.classList.remove("hidden");
  traversalResetBtn.classList.remove("hidden");
});



traversalResetBtn.addEventListener("click", () => {
  clearHighlights(traversalMatrixContainer);
  traversalExplanation.textContent = "";
  traverseRow.value = "";
  traverseCol.value = "";

  // ✅ Hide reset until another traversal happens
  traverseBtn.classList.remove("hidden");
  traversalResetBtn.classList.add("hidden");
});




traversalNextBtn.addEventListener("click", () => {
  traversalStep.style.display = "none";
  manipulationStep.style.display = "block";
  displayMatrix(matrix, manipulationMatrixContainer);
});

goToTransposeBtn.addEventListener("click", () => {

  manipulationStep.style.display = "none";

  transposeStep.style.display = "block";

  displayMatrix(
    matrix,
    transposeOriginalContainer
  );

});

// Manipulation
manipulateBtn.addEventListener("click", () => {
  let r = parseInt(manipulateRow.value);
  let c = parseInt(manipulateCol.value);
  let val = parseInt(newValue.value);
  clearHighlights(manipulationMatrixContainer);
  if (!Number.isInteger(Number(newValue.value))) {
    showInvalid(
      newValue,
      "Please enter a valid whole number.",
      manipulationExplanation
    );
    return;
  }
  // Whole number check
  if (!Number.isInteger(Number(manipulateRow.value))) {
    showInvalid(manipulateRow, "Row index must be a whole number.", manipulationExplanation);
    return;
  }

  if (!Number.isInteger(Number(manipulateCol.value))) {
    showInvalid(manipulateCol, "Column index must be a whole number.", manipulationExplanation);
    return;
  }

  // Negative check
  if (r < 0) {
    showInvalid(manipulateRow, "Row index cannot be negative. Indexing starts from 0.", manipulationExplanation);
    return;
  }

  if (c < 0) {
    showInvalid(manipulateCol, "Column index cannot be negative. Indexing starts from 0.", manipulationExplanation);
    return;
  }

  // Large index check with explanation
  if (r >= row) {
    showInvalid(
      manipulateRow,
      `Invalid row index. Matrix has ${row} rows, so maximum allowed index is ${row - 1}.`,
      manipulationExplanation
    );
    return;
  }

  if (c >= column) {
    showInvalid(
      manipulateCol,
      `Invalid column index. Matrix has ${column} columns, so maximum allowed index is ${column - 1}.`,
      manipulationExplanation
    );
    return;
  }



 let oldValue = matrix[r][c];

matrix[r][c] = val;
  manipulationExplanation.innerHTML = `
<div style="background:#f8fbff;
border-left:5px solid #3b82f6;
padding:15px;
margin-top:15px;
border-radius:8px;
text-align:left;
line-height:1.8;">
<b>Updated Position :</b>
(${r}, ${c})<br>
<b>Previous Value :</b>
${oldValue}<br>
<b>New Value :</b>
${val}
<hr>
Only the selected matrix element has been modified.
All other elements remain unchanged.
The size of the matrix is also unchanged.
</div>
`;
  displayMatrix(matrix, manipulationMatrixContainer);
  highlightCell(manipulationMatrixContainer, r, c);

  manipulateBtn.classList.add("hidden");
  manipulationResetBtn.classList.remove("hidden");
  goToTransposeBtn.classList.remove("hidden");
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
  manipulateBtn.classList.remove("hidden");
  manipulationResetBtn.classList.add("hidden");
});

// Helpers for traversal/manipulation
function displayMatrix(matrixData, container) {

  container.innerHTML = "";

  // Number of columns of the matrix being displayed
  const cols = matrixData[0].length;

  container.style.gridTemplateColumns = `repeat(${cols}, 50px)`;

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

function resetPractice() {
  // Reset step counter
  currentStep = 0;

  // Clear matrix data
  matrix = [];
  elementList = [];
  nextIndex = 0;
  row = null;
  column = null;

  // Clear all inputs
  rowInput.value = "";
  colInput.value = "";
  elementsInput.style.display = "none";
  document.getElementById("values").value = "";

  traverseRow.value = "";
  traverseCol.value = "";

  manipulateRow.value = "";
  manipulateCol.value = "";
  newValue.value = "";

  // Clear containers
  matrixContainer.innerHTML = "";
  traversalMatrixContainer.innerHTML = "";
  manipulationMatrixContainer.innerHTML = "";

  // Reset explanations
  traversalExplanation.textContent = "";
  manipulationExplanation.textContent = "";
  stepExplanation.textContent = "";

  // Show only first step
  creationStep.style.display = "block";
  traversalStep.style.display = "none";
  manipulationStep.style.display = "none";
  transposeOriginalContainer.innerHTML = "";
  transposeMatrixContainer.innerHTML = "";
  transposeTitle.style.display = "none";
  matrixSteps.style.display = "block";

  // Reset buttons
  stepNextBtn.style.display = "none";
  stepNextBtn.textContent = "Step 1 → Creation";

  enterBtn.style.display = "none";
  resetButton.classList.add("hidden");
  goToTraversalBtn.classList.add("hidden");

  // Remove highlights
  clearHighlights(traversalMatrixContainer);
  clearHighlights(manipulationMatrixContainer);
  transposeStep.style.display = "none";

  transposeOriginalContainer.innerHTML = "";

  transposeMatrixContainer.innerHTML = "";

  transposeExplanation.textContent = "";

  goToTransposeBtn.classList.add("hidden");

  transposeBtn.classList.remove("hidden");

  transposeResetBtn.classList.add("hidden");
}


transposeBtn.addEventListener("click", () => {

  let transpose = [];

  // Create transpose matrix
  for (let c = 0; c < column; c++) {
    transpose[c] = [];

    for (let r = 0; r < row; r++) {
      transpose[c][r] = matrix[r][c];
    }
  }

  // Show transpose heading
  transposeTitle.style.display = "block";

  // Display transpose matrix
  displayMatrix(transpose, transposeMatrixContainer);

  // Show explanation
  let explanation = `
<div style="background:#f8fbff;
            border-left:5px solid #3b82f6;
            padding:15px;
            margin-top:15px;
            border-radius:8px;
            text-align:left;
            line-height:1.8;">

<p>
<b>Original Matrix Size:</b> ${row} × ${column}<br>
<b>Transpose Matrix Size:</b> ${column} × ${row}
</p>

<p>
In a transpose, <b>every row becomes a column</b> and
<b>every column becomes a row</b>.
Each element changes its position from
<b>(i, j)</b> to <b>(j, i)</b>.
</p>

<hr>

<b>Element Position Changes</b><br><br>
`;

  for (let r = 0; r < row; r++) {

    for (let c = 0; c < column; c++) {

      explanation +=
        `Element <b>${matrix[r][c]}</b> :
        (${r}, ${c}) → (${c}, ${r})<br>`;

    }

  }

  explanation += `
</div>
`;

  transposeExplanation.innerHTML = explanation;

  // Hide Generate button & show Reset button
  transposeBtn.classList.add("hidden");
  transposeResetBtn.classList.remove("hidden");

});


transposeResetBtn.addEventListener("click", () => {

  // Remove transpose matrix
  transposeMatrixContainer.innerHTML = "";

  // Remove explanation
  transposeExplanation.textContent = "";

  // Hide transpose title
  transposeTitle.style.display = "none";

  // Show Generate button again
  transposeBtn.classList.remove("hidden");

  // Hide Reset button
  transposeResetBtn.classList.add("hidden");

  // Redisplay original matrix
  displayMatrix(matrix, transposeOriginalContainer);

});