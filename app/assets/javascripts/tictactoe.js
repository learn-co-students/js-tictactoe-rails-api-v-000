const winningCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
let turn = 0;
let currentGame = 0;
let winner = false;

$(document).ready(function() {
  setListeners();
});

function setListeners() {
  $('td').on('click', function() {
    move(this);
  })

  $('#previous').on('click', function() {
   previousGames();
 })
 $('#save').on('click', function() {
   saveGame();
 })
 $('#clear').on('click', function() {
   clearGame();
 })
}

function move(cell){
  if(!winner && $(cell).text() === ""){
    $(cell).text(player());
    ++turn;
    checkWinner();
  }
}

function player(){
  return (turn % 2 === 0 ? "X" : "O")
}

function checkWinner(){
  let board = currentBoard()
  for (combo of winningCombos) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]){
      winner = board[combo[0]]
      $('#message').text(`Player ${winner} Won!`)
    }
  }
  if(turn === 9 && !winner){
    winner = "Cats"
    $('#message').text(`Cats game!`)
  }
}

function currentBoard(){
  let board = {};
  $('td').map(function(index, square) {
    board[index] = square.innerHTML;
  })
  return board
}

function clearGame(){
  winner = false;
  turn = 0;
  $('td, #message').text("")
}


function previousGames(){
  console.log("Your games...")
}

function saveGame(){
  console.log("saved!")
}
