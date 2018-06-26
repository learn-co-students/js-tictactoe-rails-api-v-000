const WINNING_COMBOS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

$(attachListeners);

var turn = 0;
var currentGameId = 0;

var player = () => turn % 2 === 0 ? 'X' : 'O';

function updateState(td) {
  $(td).text(player());
};

function setMessage(message) {
  $("#message").text(message);
};

function checkWinner() {
  var winner = false;
  var board = [];

  $('td').text((index, token) => board[index] = token);

  WINNING_COMBOS.forEach(combo => {
    if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] !== "") {
      setMessage(`Player ${board[combo[0]]} Won!`)
      return winner = true
    };
  });
  return winner;
};

function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    saveGame();
    clearGame();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    clearGame();
  };
};

function attachListeners() {
  $('td').on("click", function() {
    if($(this).text() === "" && !checkWinner()) {
      doTurn(this);
    };
  });
  $('#save').click(() => saveGame());
  $('#previous').click(() => previousGame());
  $('#clear').click(() => clearGame());
};

function saveGame() {
  let state = Array.from($('td'), e => e.innerText);
  if (currentGameId) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGameId}`,
      dataType: 'json',
      data: {state: state}
    });
  } else {
    $.post('/games', {state: state}, function(game) {
      currentGameId = game.data.id;
    });
  };
};

function previousGame() {
  $('#games').html("")
  $.get('/games').done(function(games) {
    games.data.forEach(function(game) {
      $('#games').append(`<button id="gameid-${game.id}">Game: ${game.id}</button><br>`);
      $('#gameid-' + game.id).click(() => loadGame(game.id));
    });
  });
};

function loadGame(gameId) {
  $('#message').text("");
  var id = gameId;
  $.get(`/games/${gameId}`, function(game) {
    var state = game.data.attributes.state;
    $('td').text((index, token) => state[index]);
    currentGameId = id;
    turn = state.join('').length
    checkWinner();
  });
};

function clearGame() {
  $('td').empty();
  turn = 0;
  currentGameId = 0;
};
