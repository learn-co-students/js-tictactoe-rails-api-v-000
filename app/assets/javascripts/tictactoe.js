var WINNING_COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
var turn = 0;
var currentGameId = 0;

$(document).ready(function() {
  attachListeners();
})

var player = () => turn % 2 ? 'O' : 'X';

function updateState(square) {
  var token = player();
  $(square).text(token);
}

function setMessage(message) {
  $('#message').text(message);
}

function checkWinner() {
  var winner = false;
  var board = {};
  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.some( function(combo) {
    if ( board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      winner = true;
    }
  });

  return winner;
}

function resetBoard(){
  turn = 0;
  $('td').empty();
  currentGameId = 0
}

function doTurn(square) {
  updateState(square);
  turn ++;
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    saveGame();
    setMessage("Tie game.");
    resetBoard();
  }
}

function attachListeners() {
  $('td').on('click', function() {
    if ( !$.text(this) && !checkWinner()) {
      doTurn(this)
    }
  });

  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
}

function saveGame() {
  var board = [];
  var state;

  $('td').text((index, square) => board.push(square));
  state = {board: board};

  if (currentGameId) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGameId}`,
      data: state
    });
  } else {
    $.post('/games', state, function(response) {
      currentGameId = response["data"]["id"];
      $("#games").append(`<button id="game_id_${currentGameId}">Id: ${currentGameId}</button><br>`)
      $("#game_id_" + currentGameId).on('click', () => reloadGame(currentGameId))
    });
  }
}

function showPreviousGames() {
  $("#games").empty();
  $.get("/games", function(response) {
    if (response.data.length) {
      response.data.forEach(function(game) {
        $('#games').append(`<button id="game_id_${game.id}">${game.id}</button><br>`);
        $(`#game_id_${game.id}`).on('click', () => reloadGame(game.id));
      });
    }
  });
}

function checkTurn(array) {
  array.forEach((elem) => {
    if (elem !== "") {
      turn ++
    }
  });
  return turn
}

function reloadGame(gameId) {
  // delete any type of message ight have been printed
  $('#message').text("");
  $.get('/games/' + gameId, function(resp) {
    var index = 0;
    var state = resp.data.attributes.state;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        $("[data-x='" + x + "'] [data-y='" + y + "']").html(state[index]);
        index++;
      }
    }
    currentGame = resp.data.id;
    checkTurn(state)
    if(!checkWinner() && turn === 9){
      $('#message').text("Tie game.");
    }
  });

}
