// Code your JavaScript / jQuery solution here
$(function() {
  attachListeners();
})

const WIN_COMBINATIONS = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal 1
  [2, 4, 6]  // diagonal 2
]

window.turn = 0;
let currentGame = 0;
let winner = "";

function player() {
  if (window.turn % 2 == 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(square) {
  square.innerText = player();
}

function isBoardFull() {
  const board = window.document.querySelectorAll('td');
  let isFull = true;

  board.forEach(function(square) {
    if (square.innerHTML === "") {
      isFull = false;
    }
  })

  return isFull
}

function isValidMove(square) {
  return square.innerHTML === "";
}

function setMessage(message) {
  $("div#message").text(message);
}

function getTurn() {
  const board = window.document.querySelectorAll('td');
  window.turn = 0;

  board.forEach(function(square) {
    if (square.innerText !== "") window.turn++;
  })

  return window.turn;
}

function isWinningComboPresent() {
  const board = window.document.querySelectorAll('td');
  let winningComboPresent = false;

  WIN_COMBINATIONS.forEach(function(winning_combination) {
    let win_index_1 = winning_combination[0]
    let win_index_2 = winning_combination[1]
    let win_index_3 = winning_combination[2]

    let position_1 = board[win_index_1].innerHTML;
    let position_2 = board[win_index_2].innerHTML;
    let position_3 = board[win_index_3].innerHTML;

    if ( (position_1 === "X" && position_2 === "X" && position_3 === "X") ||
         (position_1 === "O" && position_2 === "O" && position_3 === "O") ) {
      winningComboPresent = true;
      winner = position_1;  // "X" or "O"
    }
  })

  return winningComboPresent;
}

function checkWinner() {
  if (isWinningComboPresent()) {
    setMessage(`Player ${winner} Won!`);
    saveGame();
    return true;
  }

  return false;
}

function resetBoard() {
  const board = window.document.querySelectorAll('td');

  board.forEach(function(square) {
    square.innerHTML = "";
  })
}

function doTurn(square) {

  if (isValidMove(square)) {
    updateState(square);
    window.turn++;

    if (checkWinner()) {
      resetBoard();
      window.turn = 0;
    };

    if (isBoardFull()) {
      setMessage("Tie game.");
      saveGame();
      resetBoard();
      window.turn = 0;
    }
  }

}

function attachListeners() {

  attachSquareListeners();

  $("#save").on('click', function() {
    saveGame();
  })

  $("#previous").on('click', function() {
    previousGames();
  })

  $("#clear").on('click', function() {
    clearGame();
  })
}

function attachSquareListeners() {
  const board = window.document.querySelectorAll('td');

  board.forEach(function(square) {
    square.addEventListener('click', function(e) {
      if (!isWinningComboPresent()) {
        doTurn(square);
      }
    })
  })
}

function saveGame() {
  let state = [];
  let gameData = {};

  $("td").text(function(i, data) {
    state.push(data);
  });

  gameData = { state: state };

  if (currentGame) {
    $.ajax({
      method: 'PATCH',
      url: `/games/${currentGame}`,
      data: gameData
    })
  } else {
    $.ajax({
      method: 'POST',
      url: '/games',
      data: gameData,
      success: function(game) {
        currentGame = game.data.id;
        $("#games").append(`<button id="gameId-${game.data.id}">${game.data.id}</button><br>`);
        $("#gameId-" + game.data.id).on('click', function() {
          reloadGame(game.data.id);
        })
      }
    })
  }
}

function previousGames() {
  let gamesHtml = "";

  $.get('/games', function(games) {
    $("#games").html("");

    games.data.forEach(function(game) {
      $("#games").append(`<button id="gameId-${game.id}">${game.id}</button><br>`);
      $("#gameId-" + game.id).on('click', function() {
        reloadGame(game.id);
      })
    })
  })
}

function clearGame() {
  const board = window.document.querySelectorAll('td');

  board.forEach(function(square) {
    square.innerText = "";
  })

  window.turn = 0;
  currentGame = 0;
}

function reloadGame(id) {
  let board = window.document.querySelectorAll('td');
  currentGame = id;

  $.get('/games/' + id, function(game) {
    game.data.attributes.state.forEach(function(square, i) {
      board[i].innerText = square;
    })
  })
  .done(function() {
    window.turn = getTurn();
  })
}
