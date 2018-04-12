// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var currentgameID = 0;

$(document).ready(function() {
  attachListeners();
  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $('#clear').on('click', () => resetBoard());
});

var player = () => turn % 2 ? 'O' : 'X';

function updateState(position) {
  var token = player();
  $(position).text(token);
}

function setMessage(string) {
  $('#message').text(string);
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}

function doTurn(position) {
  updateState(position);
  turn++;
  if (checkWinner()) {
    saveGame();
    resetBoard();
  }
  else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function resetBoard() {
  $('td').empty();
  turn = 0;
  currentgameID = 0;
}

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });
}

function saveGame() {
  var state = [];

  $('td').text((index, square) => {
    state.push(square);
  });

  var gameData = { state: state };

  if (currentgameID) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentgameID}`,
      data: gameData
    });
  } else {
    $.post('/games', gameData, function(game) {
      currentgameID = game.data.id;
      $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
      $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
    });
  }
}

function showPreviousGames() {
  $('#games').empty();
  $.get('/games', (savedGames) => {
    if (savedGames.data.length > 0) {
      savedGames.data.forEach(myFunction);
    }
  });
  function myFunction(game){
    $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
    $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
  };

}


function reloadGame(gameID) {
  $('#message').empty();
  let req = new XMLHttpRequest();
  req.overrideMimeType('application/json');
  req.open('GET', `/games/${gameID}`, true);
  req.onload = () => {
    const savedGame = JSON.parse(req.responseText).data;
    const state = savedGame.attributes.state;

    for (let index = 0; index < 9; index++) {
      $("table td").eq(`${index}`).text(`${state[index]}`);
    }

    turn = state.join('').length;
    currentgameID = savedGame.id;

    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
    }
  };

  req.send(null);
}
