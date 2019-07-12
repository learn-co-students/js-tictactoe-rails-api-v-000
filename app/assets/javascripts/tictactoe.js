// Code your JavaScript / jQuery solution here

const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
var turn = 0;
var currentGame = 0;

$(document).ready(function() {
    attachListeners();
});

function player() {
  if (turn % 2 === 0) {
   return "X";
} else {
  return "O";
 }
}

function updateState(square) {
var currentPlayer = player();
$(square).text(currentPlayer);
}

function setMessage(message) {
  $('#message').text(message);
}

function checkWinner() {
  var winner = false;
  var board = {};

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.forEach(function(position) {
    if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && !!board[position[0]]) {
      setMessage(`Player ${board[position[0]]} Won!`)
      return winner = true;
    }
  })
  return winner;
}

// function doTurn(square) {
// updateState(square);
//   turn++;
//   if (checkWinner()) {
//     clearBoard();
//   } else if (turn === 9){
//     setMessage("Tie game.")
//     clearBoard();
//   }
// }

function doTurn(square) {
updateState(square);
  turn++;
  if (checkWinner() || turn === 9){
    setMessage("Tie game.")
    saveGame();
    clearBoard();
  }
}


function attachListeners() {
  $('td').on('click', function(){
    if (!checkWinner() && !$.text(this)) {
      doTurn(this);
    }
  })
  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => previousGames());
  $('#clear').on('click', () => clearBoard());
}


function previousGames() {
  $('#games').empty();
  var $gameDiv = $('#games');

  $.ajax({
    type: 'GET',
    url: '/games',
    success: function(games) {
      games.data.forEach(function(game) {
        $gameDiv.append(`<button id="gameid-${game.id}">${game.id}</button>`);

        $(`#gameid-${game.id}`).on('click', () => loadGame(game.id));
      })
    }
  })
}

function loadGame(id){

  $.get(`/games/${id}`, function(game) {
      state = game.data.attributes.state
      debugger
      squares = document.querySelectorAll("td")
      currentGame = id;
      turn = state.join("").length;
      var i = 0;
      squares.forEach(function(square) {
          square.innerHTML = state[i];
          i++;
      })
  })
}

function saveGame() {
var state = []
$('td').text((index,square) => {
  state.push(square)
})

var gameData = {state:state};

if (currentGame) {
  $.ajax({
    type: 'PATCH',
    url: `/games/${currentGame}`,
    data: gameData
  })
} else {
  $.ajax({
    type: 'POST',
    url: '/games',
    data: gameData,
    success: function(gameData) {
      currentGame = gameData.data.id

      $('#games').append(`<button id="gameid-${currentGame}">${currentGame}</button>`)
      $("#gameid-" + currentGame).on('click', () => loadGame(currentGame));
    }
  })
 }
}


function clearBoard() {
    $('td').empty();
    turn = 0;
    currentGame = 0;
}
