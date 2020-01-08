// Code your JavaScript / jQuery solution here
var turn = 0
var WINNING_COMBINATION = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];
var gameId = 0;

$( document ).ready(function() {
    attachListeners();
});

function attachListeners(){
  $("#save").click(() => saveGame());
  $("#previous").click(() => previousGame());
  $("#clear").click(() => clearGame());

  $('td').click(function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });
}

function player() {
  if (turn % 2 === 0 ) {
    return 'X'
  }else {
    return 'O'
  };
}

function updateState(square) {
  $(square).text(player());

};

function setMessage(message) {
  $("#message").text(message);
};

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text( function (index, square) {
    board[index] = square
  });
  WINNING_COMBINATION.forEach(function(position) {
    if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== "") {
      setMessage(`Player ${board[position[0]]} Won!`)
      return winner = true;
    }
  });
  return winner;
}

function doTurn(e) {
  updateState(e);
  turn++;
  if (checkWinner()) {
    saveGame();
    clearGame();
  } else if (turn === 9) {
    setMessage("Tie game.");
     saveGame();
     clearGame();

  }
}

function clearGame() {
  $('td').empty()
  turn = 0;
  gameId = 0
  // $("#message").empty();
}


function saveGame() {
  var state = []

  $('td').text( function (index, square) {
    state.push(square)
  });

  var gameData = { state: state}

  if (gameId === 0) {
    $.post('/games', gameData, function(game) {
      gameId =  game.data.id;
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
  $("#games").empty();
  $.get('/games', function(games) {
    if (games.data.length > 0) {
      games.data.forEach(function(game){
        $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
        $(`#gameid-${game.id}`).click(() => findGame(game.id));
      });
    }
  });
}

function findGame(id) {
  $("#message").text = '';

  $.get(`/games/${id}`, function(response) {
    gameId = response.data.id;
    let board = response.data.attributes.state;
    turn = board.join("").length;
    i = 0;
    board.forEach((e) => {$('td')[i].innerHTML = e, i++})
  });
}