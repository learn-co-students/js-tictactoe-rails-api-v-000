// Code your JavaScript / jQuery solution here
var turn = 0;
var id = 0;

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function updateState(square) {
  square.innerHTML = player();
}

function setMessage(string) {
  document.getElementById("message").innerHTML = string;
}

function saveGame() {
  const board = [];
  document.querySelectorAll("td").forEach(function(square) {
    board.push(square.innerHTML);
  });

  if (id > 0) {
    $.ajax({
      url : `/games/${id}`,
      data : {state: board},
      type : 'PATCH',
    });
  } else {
    $.post({
      url : "/games",
      data : {state: board},
    }).done(function(game) {
      id = game.data.id;
    });
  }
}

function checkWinner() {
  let winner = false

  const board = [];
  document.querySelectorAll("td").forEach(function(square) {
    board.push(square.innerHTML);
  });

  const winningCombos = [[board[0], board[1], board[2]], [board[3], board[4], board[5]],
  [board[6], board[7], board[8]], [board[0], board[3], board[6]],
  [board[1], board[4], board[7]], [board[2], board[5], board[8]],
  [board[0], board[4], board[8]], [board[2], board[4], board[6]]]

  winningCombos.forEach(function(combo) {
    let checkX = combo.every(function(square) {
      return square === "X"
    })
    let checkO = combo.every(function(square) {
      return square === "O"
    });

    if (checkX) {
      setMessage("Player X Won!");
      return winner = true;
    } else if (checkO) {
      setMessage("Player O Won!");
      return winner = true;
    }
  });
  return winner;
}

function resetGame() {
  document.querySelectorAll("td").forEach(function(square) {
    square.innerHTML = "";
  });
  turn = 0;
  id = 0;
}

function doTurn(square) {
  if (square.innerHTML === "") {
    updateState(square);
    turn += 1;
  }

  if (checkWinner()) {
    saveGame();
    resetGame();
  } else if (turn >= 9) {
    setMessage("Tie game.");
    saveGame();
    resetGame();
  }
}

function attachListeners() {
  document.querySelectorAll("td").forEach(function(square) {
    square.addEventListener("click", function() {
      if (!$.text(this) && !checkWinner()) {
        doTurn(this);
      }
    });
  });

  document.getElementById('save').addEventListener("click", function() {
    saveGame();
  });

  document.getElementById('previous').addEventListener("click", function() {
    $.getJSON("/games", function(games) {
      if (games.data.length > 0) {
        $("#games").empty();
        games.data.forEach(function(game) {
          let $button = `<button id="gameid-${game.id}">${game.id}</button><br>`
          $("#games").append($button);
          document.getElementById(`gameid-${game.id}`).addEventListener("click", function() {
            document.getElementById('message').innerHTML = '';
            $.getJSON(`/games/${game.id}`, function(game) {
              let index = 0;
              document.querySelectorAll("td").forEach(function(square) {
                square.innerHTML = game.data.attributes.state[index];
                index += 1;
              });
              id = game.data.id;
              turn = game.data.attributes.state.join("").length;
            })
          })
        });
      }
    });
  });

  document.getElementById('clear').addEventListener("click", function() {
    id = 0;
    resetGame();
  });
}

$(function() {
  attachListeners();
})
