// Code your JavaScript / jQuery solution here

////////////////////////////////////////////////////////
// Global Variables
////////////////////////////////////////////////////////

var turn = 0;
var winningCombo = [
  [0,1,2], // TOP ROW
  [3,4,5], // MIDDLE ROW
  [6,7,8], // BOTTOM ROW
  [0,3,6], // FIRST COLUMN
  [1,4,7], // MIDDLE COLUMN
  [2,5,8], // LAST COLUMN
  [0,4,8], // DIAGONAL TOP LEFT, BOTTOM RIGHT
  [2,4,6]  // DIAGONAL TOP RIGHT, BOTTOM LEFT
];

////////////////////////////////////////////////////////
// DOM Elements
////////////////////////////////////////////////////////

var squares = document.getElementsByTagName('td');

////////////////////////////////////////////////////////
// Global Functions
////////////////////////////////////////////////////////

function toArr(collection){
	let arr = Array.prototype.slice.call(collection);
	return arr.map(function(a) { return a.textContent; })
}

// Returns 'X' when even, 'O' when odd.
function isEven(num) {
  return num % 2 === 0;
}

function player() {
  return isEven(turn) ? "X" : "O";
}

var updateState = (square) => {
  let playerToken = player();
  $(square).text(playerToken);
};

var setMessage = (msg) => {
  $('#message').html(msg);
}

function checkWinner(){
  let token = player();
  let table = toArr(squares);
  for(let combo of winningCombo) {
    if (table[combo[0]] !== "" && table[combo[0]] === table[combo[1]] && table[combo[1]] === table[combo[2]]) {
        return true;
      }
    }
  return false;
}

$(function() {

  ////////////////////////////////////////////////////////
  // Event Listeners
  ////////////////////////////////////////////////////////

  // $(table).on('click', 'td', function(e) {
  //   $target = $(e.target);
  //   xCoord = $target.data("x");
  //   yCoord = $target.data("y");
  //
  // });


}); // End of  .ready() function
