// Code your JavaScript / jQuery solution here

var turn = 0;

var board = ["", "", "", "", "", "", "", "", ""]

const WIN_COMBOS = [
   [0,1,2],
   [3,4,5],
   [6,7,8],
   [0,3,6],
   [1,4,7],
   [2,5,8],
   [0,4,8],
   [2,4,6] ]

function player(){
  if (turn % 2) {
    return 'O';
  } else {
    return 'X';
  }
}

function resetBoard() {
  $('td').empty();
  turn = 0;
  }


function updateState(position) {
  var token = player();
    $(position).text(token);
}

function setMessage(string) {
  $( "#message" ).append(string);
}



function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text((index, position) => board[index] = position);

  WIN_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}

function doTurn(position) {
  updateState(position);
  turn++;
  if (checkWinner()) {
    resetBoard();
  } else if (turn === 9){
    setMessage('Tie game.')
    resetBoard();
  }
}

function attachListeners() {
  $('td').on('click', function() {
   if (!$.text(this) && !checkWinner()) {
     doTurn(this);
   }
 });
 $('#save').on('click', () => saveGame());
 $('#clear').on('click', () => resetBoard());
}
//checkWinner()
// Returns true if the current board contains any winning combinations (three X
//   or O tokens in a row, vertically, horizontally, or diagonally). Otherwise,
//   returns false. If there is a winning combination on the board, checkWinner()
//   should invoke setMessage(), passing in the appropriate string based on who
//   won: 'Player X Won!' or 'Player O Won!'


//Accepts a string and adds it to the div#message element in the DOM.

//updateState()
//Invokes player() and adds the returned string ('X' or 'O') to the clicked
// square on the game board.
