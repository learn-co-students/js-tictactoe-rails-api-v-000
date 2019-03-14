// Code your JavaScript / jQuery solution here
board = [
  [
    [''],[''],['']
  ],
  [
    [''],[''],['']
  ],
  [
    [''],[''],['']
  ]
]


let turn = 1

const board = [
  $('table td[data-x=' + 0 + '][data-y=' + 0 + ']')[0].innerHTML,
  $('table td[data-x=' + 1 + '][data-y=' + 0 + ']')[0].innerHTML,
  $('table td[data-x=' + 2 + '][data-y=' + 0 + ']')[0].innerHTML,
  $('table td[data-x=' + 0 + '][data-y=' + 1 + ']')[0].innerHTML,
  $('table td[data-x=' + 1 + '][data-y=' + 1 + ']')[0].innerHTML,
  $('table td[data-x=' + 2 + '][data-y=' + 1 + ']')[0].innerHTML,
  $('table td[data-x=' + 0 + '][data-y=' + 2 + ']')[0].innerHTML,
  $('table td[data-x=' + 1 + '][data-y=' + 2 + ']')[0].innerHTML,
  $('table td[data-x=' + 2 + '][data-y=' + 2 + ']')[0].innerHTML
]

// ALL OF THE WINNING COMBINATIONS
function winning_combos() {
  return [
  [0,1,2],            // Top-row
  [0,3,6],            // Left column
  [0,4,8],            // T-left-B-right
  [1,4,7],            // Middle column
  [2,5,8],            // Right column
  [2,4,6],            // T-right-B-left
  [3,4,5],            // Middle row
  [6,7,8],            // Bottom row
  ]
}

function player() {
  return turn % 2 === 0 ? 'X' : 'O'
};

function updateState(position) {

};

function setMessage() {};

function checkWinner() {};

function doTurn () {};

function attachListeners() {};

$(function() {

})
