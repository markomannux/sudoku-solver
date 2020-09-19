const textArea = document.getElementById('text-input');
const clearButton = document.getElementById('clear-button');
const solveButton = document.getElementById('solve-button');
// import { puzzlesAndSolutions } from './puzzle-strings.js';

document.addEventListener('DOMContentLoaded', () => {
  // Load a simple puzzle into the text area
  textArea.value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  setGrid();  
  textArea.addEventListener('input', setGrid);
  [...document.querySelectorAll('.sudoku-input')].forEach(cell => {
    cell.addEventListener('input', setTextarea);
  })
  clearButton.addEventListener('click', clearInput);
  solveButton.addEventListener('click', handleSolveButtonClicked)
});

const acceptedCellInput = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];


function validateCellInput(input) {
  return acceptedCellInput.indexOf(input) !== -1;
}

function parsePuzzle(input) {
  document.getElementById('error-msg').textContent = ''
  if (input.length !== 81) {
    document.getElementById('error-msg').textContent = 'Error: Expected puzzle to be 81 characters long.';
    return;
  }

  const puzzle = [];
  for (let row = 0; row < 9; row++) {
    puzzle[row] = [];
    for (let col = 0; col < 9; col++) {
      puzzle[row][col] = input[9*row + col];
    }
  }

  return puzzle;
}

function solvePuzzle(puzzle) {
  
  if(!puzzle) return;

  const solved = []
  puzzle.forEach((row, i) => {
    solved[i] = [...row];
  })

  while(!isPuzzleValid(solved)){
    for (let row = 0; row < solved.length; row++) {
      for (let col = 0; col < solved[row].length; col++) {
        if(solved[row][col] === '.') {
          const possibleSolutions = solveCell(solved, row, col);
          if(possibleSolutions.length === 1) {
            solved[row][col] = possibleSolutions[0];
          }
        } else {
          solved[row][col] = solved[row][col];
        }
      }
    }
  }
  
  return solved;
}

function solveCell(puzzle, row, col) {
  const cellSolutions = [...acceptedCellInput];

  removeRowValues(cellSolutions, puzzle, row);
  removeColValues(cellSolutions, puzzle, col);
  removeQuadrantValues(cellSolutions, puzzle, row, col);

  return cellSolutions;
}

function removeRowValues(cellSolutions, puzzle, row) {
  return solveRegion(cellSolutions, puzzle, row, 0, 1, 9);
}

function removeColValues(cellSolutions, puzzle, col) {
  return solveRegion(cellSolutions, puzzle, 0, col, 9, 1);
}

function removeQuadrantValues(cellSolutions, puzzle, row, col) {
  const startRow = Math.floor(row/3) * 3
  const startCol = Math.floor(col/3) * 3
  return solveRegion(cellSolutions, puzzle, startRow, startCol, 3, 3);
}

function solveRegion(cellSolutions, puzzle, startRow, startCol, height, width) {
  const regionValues = getRegionValues(puzzle, startRow, startCol, height, width);
  
  regionValues.forEach(val => {
    const index = cellSolutions.indexOf(val);
    if (index > -1) {
      cellSolutions.splice(index, 1);
    }
  })

  return cellSolutions;
}


function isPuzzleValid(puzzle) {
  for (let row = 0; row < 9; row++) {
    if (!isRowValid(puzzle, row)) return false;    
  }

  for (let col = 0; col < 9; col++) {
    if (!isColValid(puzzle, col)) return false;    
  }

  for (let row = 0; row < 9; row+=3) {
    for (let col = 0; col < 9; col+=3) {
      if (!isQuadrantValid(puzzle, row, col)) return false;
    }
  }

  return true;
}

function isRowValid(puzzle, row) {
  return isRegionValid(puzzle, row, 0, 1, 9);
}

function isColValid(puzzle, col) {
  return isRegionValid(puzzle, 0, col, 9, 1);
}

function isQuadrantValid(puzzle, row, col) {
  return isRegionValid(puzzle, row, col, 3, 3);
}

function isRegionValid(puzzle, startRow, startCol, height, width) {
  const puzzleRegion = getRegionValues(puzzle, startRow, startCol, height, width);
  return acceptedCellInput.reduce((acc, curr) => {
    return acc && (puzzleRegion.indexOf(curr) !== -1)
  }, true);
}

function getRegionValues(puzzle, startRow, startCol, height, width) {
  const puzzleRegion = [];
  for (let r = startRow; r < startRow+height; r++) {
    for (let c = startCol; c < startCol+width; c++) {
      puzzleRegion.push(puzzle[r][c]);
    }
  }

  return puzzleRegion;
}

function setGrid() {
  
  console.log('setGrid')
  setGridWith(parsePuzzle(textArea.value))
}

function setGridWith(puzzle) {
  if (puzzle) {
    const cells = [...document.querySelectorAll('.sudoku-input')];
    for (let row = 0; row < puzzle.length; row++) {
      for (let col = 0; col < puzzle[row].length; col++) {
        const element = puzzle[row][col];
        if (acceptedCellInput.indexOf(element) !== -1) {
          cells[row*9 + col].value = element;
        }
      }
    }
  }
}

function setTextarea() {
  console.log('setTextarea')
  const cells = [...document.querySelectorAll('.sudoku-input')];
  textArea.value = cells.reduce((acc, curr) => {
    let cellValue = '.';
    if (acceptedCellInput.indexOf(curr.value) !== -1) {
      cellValue=curr.value;
    }
    acc+=cellValue;
    return acc; 
  }, '')
}

function puzzleToString(puzzle) {
  let output = '';
  puzzle.forEach(row => {
    row.forEach(cell => {
      output+=cell
    })
  })
  return output;
}

function clearInput() {
  const grid = [...document.querySelectorAll('.sudoku-input')]
  textArea.value = '';
  grid.forEach(cell => {
    cell.value = '';
  })
}

function showSolution(puzzle) {
  if (puzzle) {
    setGridWith(puzzle);
    setTextarea();
  }
}

function handleSolveButtonClicked() {
  const solved = solvePuzzle(parsePuzzle(textArea.value))
  showSolution(solved);
}


/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    validateCellInput,
    parsePuzzle,
    isPuzzleValid,
    solvePuzzle,
    setGrid,
    setTextarea,
    clearInput,
    showSolution,
    puzzleToString
  }
} catch (e) {}
