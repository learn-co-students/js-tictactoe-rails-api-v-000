// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;
var win_combinations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
]

function player() {
  return turn % 2 === 0 ? 'X' : 'O'
}

function updateState(square) {
  $(square).text(player())
}


function setMessage(str) {
  $('div#message').text(str)
}


function checkWinner() {
  var winner = false;
  var board = [];


  $('td').text(function(index, str) {
    board[index] = str
  });

  win_combinations.forEach(function(combo) {
    if (board[combo[0]] !== "") {
      if (board[combo[0]] === board[combo[1]] && board[combo[0]] === board[combo[2]]) {
        setMessage(`Player ${board[combo[0]]} Won!`);
        return winner = true;
      }
    }
  });

  return winner;
};

function doTurn(square) {
  updateState(square);
  turn++

  if (checkWinner()) {
    saveGame();
    clearGame();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    clearGame();
  };
}

function saveGame() {
  var board = [];

  $("td").each(function() {
    board.push(this.textContent);
  });

  if (currentGame) {
    $.ajax({
      method: "PATCH",
      url: `/games/${currentGame}`,
      data: { state: board }
    });
  } else {
    $.post("/games", { state: board } ).done(function(response) {
      currentGame = response.data.id;
    });
  }
}

function previousGames() {
  $.get("/games").done(function(response) {
    if (response.data.length) {
      response.data.forEach(function(game) {
        if (game.id > $("#games button:last").text()) {
          $('#games').append(`<button onclick="loadGame(${game.id});" game-id="gameid-${game.id}">${game.id}</button>`);
        }
      });
    }
  });
}

function loadGame(id){
  $.get(`/games/${id}`, function(response) {
    currentGame = response.data.id
    var currentBoard = $("td");
    var state = response.data.attributes.state

    for (let i = 0; i < 9; i++) {
      currentBoard[i].innerHTML = state[i];
      if (state[i]) {
        turn++;
      }
    }
  })
}

function clearGame() {
  $("td").each(function() {
    $(this).text("");
  });
  turn = 0;
  currentGame = 0;
}

function attachListeners() {
  $("td").on("click", function() {
    if (this.textContent === "" && !checkWinner()) {
      doTurn(this);
    }
  });

  $("#save").on("click", function() {
    saveGame();
  });

  $("#previous").on("click", function() {
    previousGames();
  });

  $("#clear").on("click", function() {
    clearGame();
  });
}

$(document).ready(function() {
  attachListeners();
});
