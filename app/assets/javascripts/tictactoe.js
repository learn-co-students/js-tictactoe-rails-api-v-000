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
// Global General Functions
////////////////////////////////////////////////////////

function toArr(collection){
	let arr = Array.prototype.slice.call(collection);
	return arr.map(function(a) { return a.textContent; })
}

function isEven(num) {
  return num % 2 === 0;
}



////////////////////////////////////////////////////////
// Global Game Functions
////////////////////////////////////////////////////////

function resetBoard(){
  for(var sq of squares) {
	   $(sq).text('');
     turn = 0;
  };
}

function doTurn(move) {
  if (updateState(move)) {
      turn += 1;
  }

  let won = checkWinner();
  if (won) {
    resetBoard();
  } else if (turn === 9) {
    setMessage('Tie game.');
  }
}

function player() {
  return isEven(turn) ? "X" : "O";
}

var updateState = (square) => {
  let playerToken = player();
  if ( $(square).is(':empty') ) {
    $(square).text(playerToken);
    return true;
  }
};

var setMessage = (msg) => {
  $('#message').html(msg);
}

function checkWinner(){
  let token = player();
  let table = toArr(squares);
  for(let combo of winningCombo) {
    if (table[combo[0]] !== '' && table[combo[0]] === table[combo[1]] && table[combo[1]] === table[combo[2]]) {
        setMessage(`Player ${table[combo[0]]} Won!`);
        return true;
      }
    }
  return false;
}

////////////////////////////////////////////////////////
// Event Listeners
////////////////////////////////////////////////////////

function tableListener() {
  $('table').on('click', 'td', function(e) {
    if (!checkWinner()) {
      doTurn(e.target);
    }
  });
}

function clearBtnListener() {
  $('#clear').on('click', resetBoard);
}

function saveBtnListener() {
  $('#save').on('click', function(e) {
    let data = toArr(squares);
    postSave(data)
  });
}

function attachListeners() {
  tableListener();
  clearBtnListener();
  saveBtnListener();
}

////////////////////////////////////////////////////////
// AJAX Requests
////////////////////////////////////////////////////////

// 'POST', '/games' action: create
function postSave(data){
  $.post('/games', {state: data}, function(game) {

  });
}

////////////////////////////////////////////////////////
// DOM Ready()
////////////////////////////////////////////////////////

$(function() {
  attachListeners();

}); // End of  .ready() function
