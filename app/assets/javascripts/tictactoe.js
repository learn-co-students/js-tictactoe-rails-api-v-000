// Code your JavaScript / jQuery solution here

var turn = 0;

var combos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

function player() {
  if ((turn % 2) === 0 ) {
    return 'X';
  } else {
    return 'O';
  }
}

function updateState(square) {
  $(square).text(player());
}

function setMessage(message) {
  $("#message").text(message);
}

function checkWinner() {
  board = []
  winner = false

  for (var i = 0; i < 9; i++) {
    board.push($("td")[i].innerHTML)
  } 
  
  combos.some(function(combo) {
   if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
     
    setMessage(`Player ${board[combo[0]]} Won!`);
     
     return winner = true;
   }
   
 });

 return winner;
}
  

function doTurn(square) {
  updateState(square);
  turn ++
  if (checkWinner()) {
      resetBoard();
  } else if (turn === 9) {
      setMessage("Tie game.")
      resetBoard();
  }
}

function resetBoard() {
  $("td").empty();
  turn = 0;
  currentGame = 0;
}

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
     }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => previousGames());
  $('#clear').on('click', () => resetBoard());
}