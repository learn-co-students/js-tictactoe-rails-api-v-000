// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var currentgameID = 0;

$(document).ready(function() {
  attachListeners();
});

var player = () => turn % 2 ? 'O' : 'X';

function updateState(position) {
  var token = player();
  $(position).text(token);
}

function setMessage(string) {
  $('#message').empty();
  $('#message').text(string);
}

function checkWinner() {
  var board = {};
  $('td').text((index, square) => board[index] = square);

  for (combo of WINNING_COMBOS) {
    var position_1 = board[combo[0]];
    var position_2 = board[combo[1]];
    var position_3 = board[combo[2]];

    if (position_1 != "" && position_1 === position_2 && position_2 === position_3) {
      setMessage(`Player ${position_1} Won!`);
      return true;
    }
  }
  return false;
}

function checkTie() {
  if (turn === 9 && !checkWinner()) {
    setMessage("Tie game.");
    return true;
  }
  else {return false;}
}

function validMove(position) {
  if (position.innerHTML === "") {
    return true;
  }
  else {return false;}
}

function doTurn(position) {
  updateState(position);
  turn++;
  if (checkWinner() || checkTie()) {
    saveGame();
    resetBoard();
  }
}

function resetBoard() {
  $('td').empty();
  turn = 0;
  currentgameID = 0;
}

function saveGame() {
  var state = [];

  $('td').text((index, square) => {
    state.push(square);
  });

  var gameData = { state: state };

  if (!!currentgameID) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentgameID}`,
      data: gameData
    }).done(function(game){
      setMessage(`Updated game #${currentgameID}!`);
      console.log("Updated game number: ", currentgameID);
    });
  } else {
    $.post('/games', gameData, function(game) {
      currentgameID = game.data.id;
      addButton(game);
      setMessage(`Saved new game #${currentgameID}!`);
      console.log("Saved new game number: ", currentgameID)
    });
  }
}

function addButton(game){
  var button = `<button id="${game.id}">${game.id}</button><br>`
  $("#games").append(button);
  // addTime(game);
}
// function addTime(game){
//   var time = `<div id="${game.id}-time">${isoDateReviver(game.attributes.updated_at)}</div><br>`
//   $("#games").append(time);
// }

function showPreviousGames() {
  $('#games').empty();

  $.get('/games').done(function(data){
    var games = data.data;
    games.forEach(addButton);
  });
}

function isoDateReviver(value) {
  if (typeof value === 'string') {
    var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(?:([\+-])(\d{2})\:(\d{2}))?Z?$/.exec(value);
      if (a) {
        var utcMilliseconds = Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]);
        return new Date(utcMilliseconds);
      }
  }
  return value;
}

function reloadGame(gameID) {
  $.get(`/games/${gameID}`).done(function(game) {
    var state = game.data.attributes.state;
    for (let index = 0; index < state.length; index++) {
      $("table td").eq(`${index}`).text(`${state[index]}`);
    };
    turn = state.join('').length;
    currentgameID = game.data.id;
    $('#message').empty();
    if (!checkWinner() && turn === 9) {
      setMessage('Tie game.');
    };
  });
}


function attachListeners() {
  $('#clear').on('click', () => resetBoard());
  $('#save').on('click', () => saveGame());
  $('#previous').on('click', () => showPreviousGames());
  $("td").on('click', function() {
    if (validMove(this) && !checkWinner()) {
      doTurn(this);
    }
  });
  $("#games").on('click', 'button', function(e) {
    var gameId = $(e.target).attr('id');
    reloadGame(gameId);
  });
}
