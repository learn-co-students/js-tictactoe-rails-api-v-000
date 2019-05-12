// Code your JavaScript / jQuery solution here
WIN_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
]

var turn = 0;
var player = () => turn % 2 ? 'O' : 'X';

function updateState(square) {
	var token = player();
  $(square).text(token);
}

function setMessage(string) {
   $( "#message").html(string);
}

function checkWinner(board) {
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);

  WIN_COMBINATIONS.some(function(combo) {  //check if any elements match test, don't change original array 
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}


function doTurn(square) {
  updateState(square);
    turn++;
    if (checkWinner()) {
      $('td').empty();        //any cell within the grid 
      turn = 0;
      currentGame = 0;
    }
    else if (turn === 9) {  //both type and value are the same 
      setMessage("Tie game.");
      $('td').empty();       //any cell within the grid 
      turn = 0;
      currentGame = 0;
    }
}

function attachListeners() {
    $('td').on('click', function() {
    if (!$.text(this)) {
      doTurn(this);
    }
  });
    document.getElementById("button#save").addEventListener("click", saveGame);
    document.getElementById("button#previous").addEventListener("click", previousGame);
    document.getElementById("button#clear").addEventListener("click", clearGame);
}


function saveGame() {

}

function previousGame() {

}

function clearGame() {

}