// tests don't pass with let and const, not optimized for ES6
var turn = 0;
var currentGame = 0;
var winCombinations = [
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[6,4,2]
];

$(function() {
  attachListeners();
});

function isEven(num) {
  return num % 2 === 0;
}

function player() {
  return isEven(turn) == true ? "X" : "O";
}

function updateState(square) {
  $(square).text(player());
}

// function updateState(x, y) {
//   $(`[data-x=${x}][data-y=${y}]`).html(player());
// }

function setMessage(message) {
  $("#message").text(message);
}

function getBoard() {
  let td = $("td");
  let arr = [];
  $.each(td, function(key, value) {
    arr.push(value.innerHTML);
  });
  return arr;
}

function checkWinner() {
  let board = getBoard();
  let won = false;
  winCombinations.find(combo => {
    if (board[combo[0]] != "" && ((board[combo[0]] == board[combo[1]]) && (board[combo[1]] == board[combo[2]]))) {
      won = true;
      setMessage(`Player ${board[combo[0]]} Won!`);
    }
  })
  return won;
}

function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    resetBoard();
  }
}

function resetBoard() {
  turn = 0;
  let td = $("td");
  $.each(td, function(key, value) {
    value.innerHTML = "";
  });
  currentGame = 0;
}

function attachListeners() {
  $("td").on("click", function() {
    if (!checkWinner() && this.innerText === "") {
      doTurn(this);
    }
  });

  $("#clear").on("click", resetBoard);
  $("#previous").on("click", previousGames);
  $("#save").on("click", saveGame);
}

function saveGame() {
  let board = getBoard();
  if (currentGame != 0) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: {'state': board}
    });
  } else {
    $.post('/games', {'state': board}, function(game) {
      currentGame = game.data.id;
    })
  }
}

function previousGames() {
  $("#games").empty();
  $.get('/games', (game) => {
    game.data.forEach(function(game) {
      $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
      $(`#gameid-${game.id}`).on('click', () => loadGame(game.id));
    });
  });
}

function loadGame(gameId) {
  $.get('/games/' + gameId, function(data) {
    // console.log(data.data.attributes.state);
    const id = data.data.id;
    const state = data.data.attributes.state;

    let index = 0;
    let td = $("td");
    $.each(td, function(key, value) {
      value.innerHTML = state[index];
      index++;
    });

  });
}
