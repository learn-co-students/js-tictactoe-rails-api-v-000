// Code your JavaScript / jQuery solution here

$( document ).ready(attachListeners);

var WIN_COMBS = [[0,1,2],
                   [3,4,5],
                   [6,7,8],
                   [0,3,6],
                   [1,4,7],
                   [2,5,8],
                   [0,4,8],
                   [6,4,2]];

var turn = 0;
var currentGame = 0;
var state = [];

function player() {
  return (turn%2 == 0 ? "X" : "O");
};

function updateState(square) {
  let p = player();
  $(square).text(p);
};

function setMessage(str) {
  $("div#message").text(str);
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text( function (index, square) {
    board[index] = square
  });

  WIN_COMBS.forEach(function(combo) {
    if (
      board[combo[0]] == board[combo[1]] &&
      board[combo[1]] == board[combo[2]] &&
      board[combo[1]] !== ""
    ) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      winner = true;
    }
  });
  return winner;
}

function doTurn(square) {
  updateState(square);
  turn += 1;

  if (checkWinner()) {
    saveGame();
    clearGame();
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame();
    clearGame();
  };
};

function clearGame() {
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

function attachListeners() {
  $("td").on("click", function() {
    if($(this).is(':empty') && !checkWinner()) {
      doTurn(this)
    }
  });
  $("button#save").on("click", () => saveGame());
  $("button#previous").on("click", () => previousGame());
  $("button#clear").on("click", () => clearGame());
};

function saveGame() {
  var state = [];

  $('td').text((index, square) => {
    state.push(square);
  })

  var gameData = {state: state};

  if (currentGame === 0) {
    $.post('/games', gameData, function(game) {
      currentGame = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
    })
  } else {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    });
  }
}

function previousGame() {
  $("#games").empty();
  $.get('/games', function(games) {
    if (games.data.length) {
      games.data.forEach(function(game){
        $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
        $(`#gameid-${game.id}`).click(() => findGame(game.id));
      });
    }
  });
}

function findGame(id) {
  currentGame = id
  $("#message").text = '';
  $.get(`/games/${id}`, function(response) {
    gameId = response.data.id;
    let board = response.data.attributes.state;
    turn = board.join("").length;
    i = 0;
    board.forEach((e) => {$('td')[i].innerHTML = e, i++})
  });
}
