const textArea = document.getElementById('text-input');
// import { puzzlesAndSolutions } from './puzzle-strings.js';

document.addEventListener('DOMContentLoaded', () => {
  // Load a simple puzzle into the text area
  textArea.value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
});

const acceptedCellInput = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

function validateCellInput(input) {
  return acceptedCellInput.indexOf(input) !== -1;
}

function parsePuzzle(input) {
  if (input.length !== 81) {
    document.getElementById('error-msg').textContent = 'Error: Expected puzzle to be 81 characters long.';
    return;
  }

  const puzzle = {};
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  rows.forEach((row, i) => {
    const cols = Array.from(input.substring(i*9, ((i+1)*9)));

    for (let col = 0; col < 9; col++) {
      puzzle[row] = puzzle[row] || [];
      puzzle[row][col] = cols[col];
    }
  })

  return puzzle;
}

function isPuzzleValid(input) {
  let check = false;
  const puzzle = parsePuzzle(input);

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const regionsRows = [
    ['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']
  ]
  const regionsCols = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8]
  ]

  rows.forEach(row => {
    check = isRowValid(puzzle, row);
  })
  
  for (let i = 0; i < 9; i++) {
    check = check && isColumnValid(puzzle, i);
  }

  for (let i = 0; i < regionsRows.length; i++) {
    for (let j = 0; j < regionsCols.length; j++) {
      check = check && isRegionValid(puzzle, regionsRows[i], regionsRows[j]);
    }
  }

  return check;

}

function isRowValid(puzzle, row) {
  let check = true;
  acceptedCellInput.forEach(value => {
    if(puzzle[row].indexOf(value) === -1) {
      check = false;
    }
  })
  return check;
}

function isColumnValid(puzzle, col) {
  let check = true;
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const c = rows.reduce((acc, curr) => {
    acc.push(puzzle[curr][col]);
    return acc;
  }, [])

  acceptedCellInput.forEach(value => {
    if(c.indexOf(value) === -1) {
      check = false;
    }
  })
  return check;
}

function isRegionValid(puzzle, regionsRow, regionCol) {
  return false;
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
    isPuzzleValid
  }
} catch (e) {}
