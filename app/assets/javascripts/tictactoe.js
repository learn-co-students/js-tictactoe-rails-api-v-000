// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;

var player = () => turn % 2 == 0 ? "X" : "O";

function attachListeners() {
  $("td").on("click", function(e) { doTurn(e.target) })
  $("#save").on("click", function(e) { saveGame(e) })
  $("#previous").on("click", function(e) { previousGames(e) })
  $("#clear").on("click", function() { clear() })
}

// + Increments the `turn` variable by `1`.
// + Invokes the `updateState()` function, passing it the element that was clicked.
// + Invokes `checkWinner()` to determine whether the move results in a winning play.
function doTurn(targ) {

  const t = targ.innerText
  if (t != "O" && t != "X") {
    updateState(targ);
    turn += 1;


    if (checkWinner()) {
      clear();
    } else if (turn > 8) {
      setMessage("Tie game.");
      clear();
    };

  };
}

function saveGame(e) {
  e.preventDefault();
  var state = getState();
  const values = { "state": state }

  if (isNewGame()) {
    $.post('/games', values, function(json) {
      currentGame = json.data.id
    })

  } else {
    $.ajax({
      url: `/games/${currentGame}`,
      method: 'PATCH',
      data: { "state": state },
      success: function(json) {
        console.log("success savegame ajax")
      },
      fail: function(json) {
        console.log("Error savegame ajax")
      }
    });

  };

}

function previousGames(e) {

}

function clear() {
  $("td").toArray().forEach(c => c.innerText = "");
  currentGame = 0;
  turn = 0;
}

function setMessage(str) {
  $("#message").append("<p>" + str + "</p>")
}

// + Returns `true` if the current board contains any winning combinations (three `X` or `O` tokens in a row, vertically, horizontally, or diagonally). Otherwise, returns `false`.
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
  var msg = "";
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

function getState() {
  return $('td').toArray().map(function(cell) {
    return cell.innerText;
  });
}

var isNewGame = () => { return currentGame === 0}

$(function () {
  attachListeners();
});
