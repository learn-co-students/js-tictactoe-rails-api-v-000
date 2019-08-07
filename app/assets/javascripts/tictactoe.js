// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

$(document).ready(function() {
    attachListeners();
  });

var turn = 0;
var currentGame;

var player = function player() {
    return turn % 2 ? "O" : "X"
}

function updateState(square) {
    var token = player();
    $(square).text(token);
}

function setMessage(string) {
    $('#message').text(string);
}

function checkWinner() {
    var board = {};
    var winner = false;
        $('td').text(function(index, square) {
            return board[index] = square;
        });

        WINNING_COMBOS.some(function(combo) {
            if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
                setMessage(`Player ${board[combo[0]]} Won!`)
                return winner = true
            }
        })
        return winner
}

function doTurn(square) {
    updateState(square);
    turn++;
    if (checkWinner()) {
        saveGame();
        resetBoard();
    } else if (turn === 9) {
        setMessage("Tie game.");
        saveGame();
        resetBoard();
    }
}

function resetBoard() {
    $('td').empty();
    turn = 0;
    currentGame = 0;
}

function attachListeners() {
    $('td').on('click', function() {
        if (!$.text(this) && !checkWinner()) {
            doTurn(this);
        }
    });

    $('#save').on('click', function() {
        return saveGame();
    });
    $('#previous').on('click', function() {
        return showPreviousGames()
    });
    $('#clear').on('click', function() {
        return resetBoard();
    });
}

function showPreviousGames() {
    $('#games').empty();
    $.get('/games',function(savedGames) {
        if (savedGames.data.length) {
            savedGames.data.forEach(buttonizePreviousGame);
        }
    })
}

function buttonizePreviousGame(game) {
    $('#games').append('<button id="gameid-' + game.id + '">' + game.id + '</button><br>');
    $('#gameid-' + game.id).on('click', function () {
      return reloadGame(game.id);
    });
  }

  function saveGame() {
    var state = [];
    var gameData;
  
    $('td').text(function (index, square) {
      state.push(square);
    });
  
    gameData = { state: state };
  
    if (currentGame) {
      $.ajax({
        type: 'PATCH',
        url: '/games/' + currentGame,
        data: gameData
      });
    } else {
      $.post('/games', gameData, function (game) {
        currentGame = game.data.id;
        $('#games').append('<button id="gameid-' + game.data.id + '">' + game.data.id + '</button><br>');
        $("#gameid-" + game.data.id).on('click', function () {
          return reloadGame(game.data.id);
        });
      });
    }
  }

  function reloadGame(gameID) {
    document.getElementById('message').innerHTML = '';
  
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('GET', '/games/' + gameID, true);
    xhr.onload = function () {
      var data = JSON.parse(xhr.responseText).data;
      var id = data.id;
      var state = data.attributes.state;
  
      var index = 0;
      for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
          document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]').innerHTML = state[index];
          index++;
        }
      }
  
      turn = state.join('').length;
      currentGame = id;
  
      if (!checkWinner() && turn === 9) {
        setMessage('Tie game.');
      }
    };
  
    xhr.send(null);
  }