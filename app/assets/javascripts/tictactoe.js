// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;
var winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ]

$(document).ready(function() {
  attachListeners()
})

function player() {
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  }
}

function updateState(td) {
  td.innerHTML = player(turn);
}

function setMessage (message) {
  $('#message').text(message)
}

function doTurn(x,y) {
  updateState(x,y);
  checkWinner();
  turn += 1;
}

function checkWinner() {
  let board = {};
  let won = false;
  $('td').text((i, square) => board[i] = square);

  winningCombos.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      won = true;
      setMessage(`Player ${board[combo[0]]} Won!`)
    }
  });
  return won;
}

function doTurn(move) {
  updateState(move)
  turn++

  if (checkWinner()) {
    clearGame()
    saveGame()
  } else if (turn === 9) {
    setMessage("Tie game.");
    clearGame()
    saveGame()
  }
}

function attachListeners() {
  $('td').on('click', function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this)
    }
  });
  $('#previous').on('click', () => previousGames())
  $('#save').on('click', () => saveGame())
  $('#clear').on('click', () => clearGame())
}

function saveGame() {
  let state = $('td').toArray().map(e => e.innerText);
  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      dataType: 'json',
      data: {state : state}
    });
  } else {
    $.post('/games', {state: state}, function(game) {
      currentGame = game.data.id
    });
  };
}

function previousGames() {
  $('#games').empty()
  $.get('/games').done(function(games) {
    games.data.forEach(function(game) {
      $('#games').append(`<button id="gameid-${game.id}">Game: ${game.id}</button><br>`);
      $('#gameid-' + game.id).click(() => loadGame(game.id));
    });
  });
}

function clearGame() {
  $('td').empty()
  turn = 0;
  currentGame = 0;
}

function loadGame(gameId) {
  $('#message').text("");
  let id = gameId;
  $.get(`/games/${gameId}`, function(game) {
    let state = game.data.attributes.state;
    $('td').text((index, token) => state[index]);
    currentGame = id;
    turn = state.join('').length
    checkWinner()
  });
}
