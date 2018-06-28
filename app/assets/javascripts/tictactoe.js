// Code your JavaScript / jQuery solution here
$(function() {
  attachListeners();
});

var turn = 0;
var won = false;
var tie = false;
var currentGame = 0;

function player() {
  return (turn % 2 == 0 ) ? "X" : "O";
};

function doTurn(square) {
  updateState(square);
  turn += 1;
  won = checkWinner();
  if (!won && turn == 9) {
    setMessage("Tie game.");
    tie = true;
  }
  if (won || tie) {
    saveGame();
    resetBoard();
  }
};

function updateState(square) {
  $(square).html(player());
};

function setMessage(string) {
  $("#message").html(string);
};

function checkWinner() {
  const winningCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
  const squares = $("td");
  let winner = false;
  winningCombos.forEach(function(winningCombo) {
    if (squares[winningCombo[0]].innerHTML != "") {
      if (squares[winningCombo[0]].innerHTML == squares[winningCombo[1]].innerHTML && squares[winningCombo[1]].innerHTML == squares[winningCombo[2]].innerHTML) {
        setMessage(`Player ${squares[winningCombo[0]].innerHTML} Won!`);
        winner = true;
      };
    };
  });
  return winner;
};

function saveGame() {
  const returnBox = function(tds) {
    return tds.innerHTML;
  };
  const gameState = Array.from($("td"), returnBox);
  if (currentGame == 0) {
    const responseData = $.post('/games', { "state": gameState });
    responseData.done(function (data) {
      currentGame = parseInt(data.data.id);
    });
  } else {
      const responseData = $.ajax(`/games/${currentGame}`, {
        method: 'PATCH',
        data: { "state": gameState }
      });
  };
};

function resetBoard() {
  currentGame = 0;
  turn = 0;
  tie = false;
  won = false;
  $("td").html("");
};

function loadGame() {
  const gameId = this.getAttribute("data-id");
  $.getJSON(`/games/${gameId}`, function(data) {
    const gameState = data.data.attributes.state;
    $("td").each(function (i) {
      $(this).html(gameState[i]);
    });
    turn = gameState.filter(function (v) {
      return v != "";
    }).length;
    currentGame = gameId;
  });
};

function attachListeners() {
  $("td").click(function(event) {
    if (this.innerHTML == "" && !checkWinner()) {
      doTurn(this);
    }
  })

  $("#save").click(saveGame);

  $("#previous").click(function() {
    $.getJSON("/games", function(data) {
      var games = data.data;
      for (let i = 0; i < games.length; i++) {
        if ($(`#games button[data-id='${games[i].id}']`).length == 0) {
          $("#games").append(`<button class="previous-game" data-id="${games[i].id}">Game #${games[i].id}  (updated at ${games[i].attributes["updated-at"]})</button>`);
        };
      };
      $(".previous-game").click(loadGame);
    });
  });

  $("#clear").click(resetBoard);
};
