// Code your JavaScript / jQuery solution here
$(document).ready(function() {
  attachListeners();
});

var turn = 0;
var currentGame = 0;

// sets the player token to X or O
var player = () => turn % 2 ? 'O' : 'X';

// setMessage() Accepts a string and adds it to the div#message element in the DOM.
var setMessage = (note) => {
  $('#message').html('<p>' + note + '</p>')
}

function updateState(square) {
    var token = player();
    $(square).text(token)
}

function clearBoard() {
   var fullBoard = $('td')
   fullBoard.empty()
   turn = 0;
   currentGame = 0;
}

function checkWinner() {
  var winner = false
  const winningCombos = [
     [0, 1, 2],
     [3, 4, 5],
     [6, 7, 8],
     [0, 3, 6],
     [1, 4, 7],
     [2, 5, 8],
     [0, 4, 8],
     [2, 4, 6]
   ]
  var board = []
  var currentState = $('td')

  currentState.text((i, square) =>  {
    board.push(square)
  });

  winningCombos.some(function(element) {
    var position_1 = board[element[0]]
    var position_2 = board[element[1]]
    var position_3 = board[element[2]]

    if (position_1 !== "" && position_1 === position_2 && position_2 === position_3) {
           setMessage(`Player ${board[element[0]]} Won!`);
           winner = true;
      }
  });
  return winner
}

  function attachListeners(){
    $('td').on('click', function() {
      setMessage("")
      if (!$.text(this) && !checkWinner()) {
            doTurn(this);
          }
    });

    $('#previous').on('click', () => previousGames());
    $('#save').on('click', () => saveGame());
    $('#clear').on('click', () => clearBoard());
  }


function doTurn(square) {
  updateState(square);
  turn++
  if (checkWinner()) {
    clearBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    clearBoard()
  }
}


function previousGames() {
  $.get("/games", function(games) {
      $("#games").empty();
    $.each(games.data, function(index, game) {
      $("#games").append(`<button class="loadGame" id="gameID-${game.id}">Load Game ${game.id}</button><br>`);
      $(`#gameID-${game.id}`).on('click', () => loadGame(game.id))
    });
  });
  attachListeners();
}

function loadGame(game) {
  $.get(`/games/${game}`, function(data) {
      let board = $('td');
      let state = data.data.attributes.state;
      currentGame = parseInt(data.data.id);

       for (i = 0; i < state.length; i++) {
         board[i].textContent = state[i]
         console.log(board[i])
       }
       turn = state.join('').length;
  });
}

function saveGame() {
  var state = [];
    $('td').text((i, square) =>  {
      state.push(square)
    });

  var gameState = {state: state};
    if (currentGame) {
      $.ajax({
        url: `/games/${currentGame}`,
        type: 'PATCH',
        data: gameState
      });
      // setMessage("Game saved.");
    } else {
      debugger
      let saving = $.post('/games', gameState);
      saving.done(function(response) {
        clearBoard()
        previousGames();
      });
      setMessage("Game saved.");
    }
}
