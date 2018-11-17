// using var instead of let/const because tests might not be updated for ES6

// button#save
// button#previous
// button#clear

var turn = 0;
var gameId = 0;
var wins = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

function player() {
  return turn % 2 === 0 ? "X" : "O";
}


function updateState(square) {
  $(square).text(player())
}


function setMessage(message) {
  $("#message").text(message)
}

function checkWinner() {
  var board = [];
  var winner = false;

  $("td").each(function() {
    board.push(this.textContent);
  });

  wins.some(function(combo) {
    if (
      board[combo[0]] !== "" &&
      board[combo[0]] === board[combo[1]] &&
      board[combo[1]] === board[combo[2]]
    ) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return (winner = true);
    }
  });

  return winner;
}


function doTurn(space) {
  updateState(space);
  turn++;
  if (checkWinner()) {
    saveGame();
    clearGame();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    clearGame();
  };
}


function attachListeners() {
  $("td").on("click", function() {
    if ($.text(this) == "" && !checkWinner()) {
      doTurn(this);
    }
  });
  $("#save").on("click", function() {
    saveGame();
  });
  $("#previous").on("click", function() {
    previousGame();
  });
  $("#clear").on("click", function() {
    clearGame();
  });
}

function saveGame() {
  var state = [];
  $("td").each(function() {
    state.push(this.textContent);
  });
  if(gameId != 0) {
    $.ajax({
      method: "PATCH",
      url: `/games/${gameId}`,
      data: { state: state }
    });
  } else {
    var updatedGame = $.post("/games", { state: state } );
    updatedGame.done(function(response) {
      gameId = response.data.id;
    });
  }
}

function previousGame() {
  $.get("/games").done(function(response) {
    if (response.data.length !== 0) {
      response.data.forEach(function(game) {
        if (game.id > $("#games button:last").text()) {
          $("#games").append(
            `<button onclick="getBoard.call(this);" data-id="${game.id}">${game.id}</button>`
          );
        }
      });
    }
  });
}

function clearGame() {
  $("td").each(function() {
    $(this).text("");
  });
  turn = 0;
  gameId = 0;
}

function getBoard() {
  var selection = $(this).data("id");
  $.get(`/games/${selection}`).done(function(response) {
    var pulledBoard = response.data.attributes.state;
    var currentBoard = $("td");
    for (let i = 0; i < 9; i++) {
      currentBoard[i].innerHTML = pulledBoard[i];
      if (pulledBoard[i] !== "") {
        turn++;
      }
    }
    gameId = response.data.id;
  })
}

$(document).ready(function() {
  attachListeners();
});
