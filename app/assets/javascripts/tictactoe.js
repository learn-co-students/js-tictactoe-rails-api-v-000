// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;

var player = () => turn % 2 == 0 ? "X" : "O";
var isNewGame = () => { return currentGame === 0}
var getState = () => { return $('td').toArray().map(c => c.innerText)}

function attachListeners() {
  $("td").on("click", function(e) {
    if (e.target.innerText != "O" && e.target.innerText != "X" && !checkWinner()) {
      doTurn(e.target)
    }
  });
  $("#save").on("click", () => saveGame() )
  $("#previous").on("click", () => previousGames() )
  $("#clear").on("click", () => clear() )
}

function doTurn(target) {

    updateState(target);
    turn += 1;

    if (checkWinner()) {
      saveGame();
      clear();
    } else if (turn > 8) {
      setMessage("Tie game.");
      saveGame();
      clear();
    };

}

function saveGame() {
  const values = { "state": getState() }

  if (isNewGame()) {
    $.post('/games', values, (json) => {currentGame = json.data.id});
  } else {
    $.ajax({
      url: `/games/${currentGame}`,
      method: 'PATCH',
      data: values
    });
  };
}

function previousGames() {
  $.get('/games', function(resp) {
    if (resp.data.length > 0) {
      $("#games").empty();
      resp.data.forEach(game => $("#games").append(`<button data-id=${game.id}>` + game.id + "</button>"));
      attachPrevGameListeners();
    };
  });
}

function attachPrevGameListeners() {
  $("#games button").on('click', function(e) {

    $.get('/games/' + e.target.dataset.id, function(resp) {
      currentGame = resp.data.id;
      turn = 0;
      state = resp.data.attributes.state  //Array
      $("td").toArray().forEach(function(cell, index) {
        cell.innerText = state[index];

        if (state[index] != "") {
          turn++;
        };
      });

    });
  });
}

function clear() {
  $("td").toArray().forEach(c => c.innerText = "");
  currentGame = 0;
  turn = 0;
}

function setMessage(str) {
  $("#message").append("<p>" + str + "</p>");
}

function checkWinner() {
  const winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  const state = getState();
  return winningCombos.some(combo => spotsMatch(combo, state));
}

function spotsMatch(combo, state) {

  if ((state[combo[0]] != "") && (state[combo[0]] == state[combo[1]]) && (state[combo[0]] == state[combo[2]])) {
    state[combo[0]] == "X" ? setMessage("Player X Won!") : setMessage("Player O Won!");
    return true;
  } else {
    return false;
  }

}

function updateState(square) {
  square.innerText = player();
}

$(function () {
  attachListeners();
});
