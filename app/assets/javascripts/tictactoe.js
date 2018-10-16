// Code your JavaScript / jQuery solution here
var winningCombo = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

var turn = 0;
var currentGame = 0;
$(attachListeners);

function updateState(t) {
  t.innerHTML = player();
}

var player = () => turn % 2 ? 'O' : 'X'

function setMessage(message) {
  $("#message").html(message);
}

function attachListeners() {
  $("td").on("click", function() {
    if ($(this).text() == "" && !checkWinner()) {
      doTurn(this);
    }
  })

  $("#save").click(() => saveGame());
  $("#previous").click(() => previousGames());
  $("#clear").click(() => clearGame());
}
 function allXO(combo) {
  let currentBoard = {};
  $("td").text(function(i, td) {
    currentBoard[i] = td;
  })
  return combo.every(i => currentBoard[i] === "X") || combo.every(i => currentBoard[i] === "O")
}
 function checkWinner() {
  let winner = winningCombo.find(allXO);
  if (winner) {
    setMessage("Player " + $("td").eq(winner[0]).text() + " Won!")
    return !!winner;
  }
  return false;
}
 function doTurn(td) {
  updateState(td);
  turn ++;
  if (checkWinner()) {
    saveGame();
    clearGame();
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame();
    clearGame();
  }
}

 function clearGame() {
  $("td").empty();
  turn = 0;
  currentGame = 0;
}

 function saveGame() {
  let state = $("td").toArray().map(x => x.innerText);
  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: {state: state}
    });
  } else {
    $.post('/games', {state: state}).done(function(response) {
      currentGame = response.data.id
    })
  }
}

 function loadGame(gameId) {
  $("#message").text("");
  $.get(`/games/${gameId}`, function(game) {
    var state = game.data.attributes.state;
    $("td").text((i, text) => state[i]);
    currentGame = gameId;
    turn = state.join("").length
    checkWinner();
  })
}

 function previousGames() {
  $("#games").text("");
  $.get('/games', function(games) {
    games.data.map(function(game) {
      $('#games').append(`<button id="gameid-${game.id}">Game: ${game.id}</button><br>`);
      $("#gameid-" + game.id).click(() => loadGame(game.id));
    })
  })
}
