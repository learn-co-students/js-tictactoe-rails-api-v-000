// Code your JavaScript / jQuery solution here
var turn = 0
var board = {};
var currentGame = 0;
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
$(document).ready(function() {
  attachListeners();
})

function player() {
  if(turn % 2 == 0){
    return "X";
  }else {
    return "O";
  };
};

function updateState(square) {
  $(square).append(player());
}

function setMessage(message) {
  $('#message').append(message);
}

function checkWinner() {
  var winner = false;

  $('td').text(function(index, square) {
    return board[index] = square;
  });

  WINNING_COMBOS.some(function(winCombo) {
    if(board[winCombo[0]] !== "" && board[winCombo[0]] === board[winCombo[1]] && board[winCombo[1]] === board[winCombo[2]]) {
      setMessage(`Player ${board[winCombo[0]]} Won!`)
      return winner = true;
    }
  });
  return winner;
}

function emptyBoard() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

function doTurn(square) {
  updateState(square);
  turn++;
  if(checkWinner()) {
    saveGame();
    emptyBoard();
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame();
    emptyBoard();
  }
}

function saveGame() {
  var state = [];
  var gameData;
  $('td').text((index, square) => {
    state.push(square);
  });
  gameData = {state: state};
  if(currentGame) {
    $.ajax({
      type: "PATCH",
      url: `/games/${currentGame}`,
      data: gameData
    });
  }else {
    $.post('/games', gameData, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id= "gameId-${currentGame}">Game${currentGame}</button><br>`)
      $("#gameId-" + currentGame).on('click', function() {
        loadBoard(currentGame);
      })
    });
  }
}

function previousGame() {
  $('#games').empty();
  $.getJSON('/games', function(games) {
    for(i in games.data) {
      var gameId = games.data[i].id
      $('#games').append(`<button id="gameId-${gameId}">Game${gameId}</button><br>`);
      $("#gameId-" + gameId).on('click', function () {
      loadBoard(gameId);
    });
  }
});
}

function loadBoard(gameId) {
  $.get(`/games/${gameId}`, function(game) {
    var state = game.data.attributes.state;
    var index = 0;
    for (var y = 0; y < 3; y++) {
      for (var x = 0; x < 3; x++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
        index++;
      }
    }
  });
}



function attachListeners() {
  $('td').on('click', function() {

    if(this.innerHTML === "" && !checkWinner()) {
      doTurn(this);
    }
  });
  $('#save').on('click', function() {
    saveGame();
  });
  $('#previous').on('click', function() {
    previousGame();
  });
  $('#clear').on('click', function() {
    emptyBoard();
  });
}
