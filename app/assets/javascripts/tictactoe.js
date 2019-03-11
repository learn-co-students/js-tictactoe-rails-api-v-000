// Code your JavaScript / jQuery solution here
var turn = 0

const wins = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var player = () => turn % 2 ? 'O' : 'X';

// var board =[ '', '', '', '', '', '', '', '', '' ]
$(document).ready(function(){
  attachListeners();
});

function doTurn(square){
  // increments the value of the "turn" variable
  updateState(square)
  turn ++

  if (checkWinner()){
    $('td').empty()
    turn = 0
  } else if (turn === 9){
    setMessage("Tie game.")
  }
}

function attachListeners(){
  // $('td').addEventListener('click', doTurn(self))
  // $('td').on('click', doTurn(this))
// attaches event listeners that invoke doTurn() when a square is clicked on
// passes the clicked-on <td> element to doTurn():
$('td').on('click', function() {
  if (!$.text(this) && !checkWinner()) {
    doTurn(this);
  }
});

$('#save').on('click', () => saveGame());
$('#previous').on('click', () => showPreviousGames());
$('#clear').on('click', () => resetBoard());

}

function resetBoard(){
  $('td').empty()
  turn = 0
}

// function saveGame() {
//   var state = [];
//   var gameData;
//
//   $('td').text((index, square) => {
//     state.push(square);
//   });
//
//   gameData = { state: state };
//
//   if (currentGame) {
//     $.ajax({
//       type: 'PATCH',
//       url: `/games/${currentGame}`,
//       data: gameData
//     });
//   } else {
//     $.post('/games', gameData, function(game) {
//       currentGame = game.data.id;
//       $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
//       $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
//     });
//   }
// }
//
// function showPreviousGames() {
//   $('#games').empty();
//   $.get('/games', (savedGames) => {
//     if (savedGames.data.length) {
//       savedGames.data.forEach(buttonizePreviousGame);
//     }
//   });
// }

function checkWinner() {
  var winner = false;
  board = {}
$('td').text((index, square) => board[index] = square)

wins.forEach(function(position) {
  if (board[position[0]] === board[position[1]] && board[position[1]]=== board[position[2]] && board[position[0]] !== "") {
    setMessage(`Player ${board[position[0]]} Won!`)
    return winner = true
  }
})
return winner
}


function updateState(square){
  var token = player()
  $(square).text(token)
}

function setMessage(message){
  $("#message").text(message)
  // if tie, "Tie game."
  // if won, "You won"
}
