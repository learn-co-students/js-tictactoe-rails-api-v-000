// Code your JavaScript / jQuery solution here

turn = 0;
var win_combinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
var gameId = 0;

function getBoard() {
  return $("td")
    .toArray()
    .map(el => {
      return el.innerHTML;
    });
}

function resetGame() {
  $("td")
    .toArray()
    .forEach(el => {
      el.innerHTML = "";
    });
  turn = 0;
  gameId = 0;
}

function saveGame() {
  let game = { state: getBoard() };

  if (gameId === 0) {
    $.post("/games", game, function(resp) {
      gameId = parseInt(resp.data.id);
    });
  } else {
    $.ajax({
      url: `/games/${gameId}`,
      method: "PATCH",
      data: game
    }).done(function(resp) {
      setMessage("Saved");
    });
  }
}

function loadGame(id) {
  gameId = id;

  $.getJSON(`/games/${gameId}`, function(resp) {
    turn = resp.data.attributes.state.reduce(function(sum, el) {
      if (el !== "") {
        sum += 1;
      }
      return sum;
    }, 0);

    $("td")
      .toArray()
      .forEach((el, index) => {
        el.innerHTML = resp.data.attributes.state[index];
      });
  });
}

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(location) {
  let token = player();
  let move = $(location);

  move.text(token);
}

function setMessage(string) {
  $("#message").text(string);
}

function checkWinner() {
  let board = getBoard();

  for (let el of win_combinations) {
    if (board[el[0]] === "X" && board[el[1]] === "X" && board[el[2]] === "X") {
      setMessage("Player X Won!");
      return true;
    } else if (
      board[el[0]] === "O" &&
      board[el[1]] === "O" &&
      board[el[2]] === "O"
    ) {
      setMessage("Player O Won!");
      return true;
    }
  }
  return false;
}

function fullBoard() {
  let board = getBoard();

  return board.every(space => {
    return space !== "";
  });
}

function doTurn(location) {
  updateState(location);
  turn += 1;
  let won = checkWinner();
  if (won === false && fullBoard() === true) {
    setMessage("Tie game.");
    saveGame();
    resetGame();
    return;
  }

  if (won === true) {
    saveGame();
    resetGame();
    return;
  }
}

function attachListeners() {
  $("td").click(function() {
    if (this.innerHTML === "" && checkWinner() === false) {
      doTurn(this);
    }
  });

  $("#previous").click(function() {
    $.getJSON("/games", function(resp) {
      $("#games").empty();
      resp.data.forEach(function(game) {
        $("#games").append(
          `<button data-id="${game.id}" onclick="loadGame(${game.id})">${
            game.id
          }</button>`
        );
      });
    });
  });

  $("#save").click(saveGame);

  $("#clear").click(resetGame);
}

$(function() {
  attachListeners();
});
