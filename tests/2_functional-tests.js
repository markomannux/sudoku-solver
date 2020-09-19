/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chai = require("chai");
const assert = chai.assert;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

let Solver;

suite('Functional Tests', () => {
  suiteSetup(() => {
    // DOM already mocked -- load sudoku solver then run tests
    Solver = require('../public/sudoku-solver.js');
  });
  
  suite('Text area and sudoku grid update automatically', () => {
    // Entering a valid number in the text area populates 
    // the correct cell in the sudoku grid with that number
    test('Valid number in text area populates correct cell in grid', done => {
      const textArea = global.document.getElementById('text-input');
      textArea.value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      Solver.setGrid();
      const cell = global.document.getElementById('A3');

      assert.equal(cell.value, '9')
      
      done();
    });

    // Entering a valid number in the grid automatically updates
    // the puzzle string in the text area
    test('Valid number in grid updates the puzzle string in the text area', done => {
      const textArea = global.document.getElementById('text-input');
      textArea.value = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      const cell = global.document.getElementById('A3');

      cell.value = '4'
      Solver.setTextarea();

      assert.equal(textArea.value, '..4..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..')

      done();
    });
  });
  
  suite('Clear and solve buttons', () => {
    // Pressing the "Clear" button clears the sudoku 
    // grid and the text area
    test('Function clearInput()', done => {
      const textArea = global.document.getElementById('text-input');
      const grid = [...document.querySelectorAll('.sudoku-input')]
      Solver.clearInput()
      assert.equal(textArea.value, '');
      grid.forEach(cell => {
        assert.equal(cell.value, '');
      })
      done();
    });
    
    // Pressing the "Solve" button solves the puzzle and
    // fills in the grid with the solution
    test('Function showSolution(solve(input))', done => {
      const textArea = global.document.getElementById('text-input');
      textArea.value = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
      
      const solved = Solver.solvePuzzle(Solver.parsePuzzle(textArea.value));
//
      assert.equal(Solver.puzzleToString(solved), '218396745753284196496157832531672984649831257827549613962415378185763429374928561')
//
      done();
    });
  });
});

