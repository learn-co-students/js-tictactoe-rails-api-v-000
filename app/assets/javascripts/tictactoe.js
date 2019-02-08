// Code your JavaScript / jQuery solution here

$(document).ready(function() {
  attachListeners();
});

const WINNING_COMBOS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
];

var turn = 0;
var gameId = 0;
var state =[]

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(square) {
  var token = player()
  $(square).text(token);
}

function setMessage(string) {
  $('#message').text(string);
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text( function (index, square) {
    board[index] = square
  });

    WINNING_COMBOS.some(function(combo) {
        if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]]
        && board[combo[1]] === board[combo[2]]) {
          setMessage(`Player ${board[combo[0]]} Won!`);
          winner = true;
        }
      });
      return winner;
  }

  function doTurn(square) {
    updateState(square);
    turn ++;
    if(checkWinner()) {
      saveGame();
      clearGame();
    } else if (turn === 9) {
      setMessage("Tie game.");
      saveGame();
      clearGame();
    }
  }

  function clearGame() {
    $('td').empty();
    turn = 0
    gameId = 0;
  }

  function attachListeners() {
    $('td').on('click', function() {
      if (!$.text(this) && checkWinner() !== true ) {
        doTurn(this);
      }
    });

    $('#save').click(() => saveGame());
    $('#previous').click(() => previousGame());
    $('#clear').click(() => clearGame());
  }

  function saveGame() {
    var state = [];

    $('td').text((index, square) => {
      state.push(square);
    })

    var gameData = {state: state};

    if (gameId === 0) {
      $.post('/games', gameData, function(game) {
        gameId = game.data.id;
        $('#games').append(`<p>${gameId}</p>`);
      })
    } else {
      $.ajax({
        type: 'PATCH',
        url: `/games/${gameId}`,
        data: gameData
      });
    }
  }

  function previousGame() {
    $('#games').empty();
    $('#message').empty();
    $.get('/games', function(games){
      games.data.forEach(function(game){
      if (games.data.length !== 0){
        $('#games').append(`<button id="gameId-${game.id}">Game ${game.id}</button><br>`);
        $('#gameId-' + game.id).on('click', function(){
          findGame(game.id);
        });
      };
    });
  });
}

  function findGame(id) {
    $("#message").text(`/games/${id}`);
    $.get(`/games/${id}`, function(game) {
      $('#games').empty();
      gameId = game.data.id;
      state = game.data.attributes.state;
      turn = state.join('').length;
      i = 0;
      state.forEach(function(e){
        $('td')[i].innerHTML = e;
      i++;
      });
    });
  }
