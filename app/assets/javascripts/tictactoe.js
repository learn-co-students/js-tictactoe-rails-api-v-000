// Code your JavaScript / jQuery solution here
var turn = 0;
var gameId = 0;
var winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

function player(){
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(square) {
  $(square).text(player());
}

function setMessage(message) {
  $("#message").text(message);
}

function getBoard() {
  var squares = $("td");
  var board = [];
  for (var sq of squares) {
    board.push(sq.innerHTML);
  }
  return board;
}

function setBoard(state) {
  var squares = $("td");
  for (let i = 0; i < state.length; i++)  {
    $(squares[i]).html(state[i]);
  }
}

function checkWinner() {
  board = getBoard();
  for (combo of winCombos) {
    var position_1 = board[combo[0]];
    var position_2 = board[combo[1]];
    var position_3 = board[combo[2]];

    if (position_1 != "" && position_1 === position_2 && position_2 === position_3) {
      setMessage(`Player ${position_1} Won!`);
      return true;
    }
  }
  return false;
}

function validMove(square) {
  if (square.innerHTML === "") {
    return true;
  } else {
    return false ;
  }
}

function gameOver() {
  if (checkWinner() || checkTie()) {
    saveGame();
    resetGame();
    return true;
  } else {
    return false;
  }
}

function checkTie() {
  if (turn === 9 && !checkWinner()) {
    setMessage("Tie game.");
    return true;
  }
}

function resetGame() {
  var squares = $("td");
  turn = 0;
  gameId = 0;
  for(var s of squares) {
    $(s).empty();
  }
}

function doTurn(square) {
  if (validMove(square)) {
    updateState(square);
    turn += 1;
  }
  gameOver();
}

function saveGame() {
  var state = getBoard();
  var gameData = {state: state};
  if(!!gameId) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${gameId}`,
      data: gameData
    }).done(function(game) {
      console.log(game)
      gameId = game.data.id;
      console.log("updated game ", gameId);
    });
  } else {
    $.post('/games', gameData, function(game) {
      console.log(game)
      gameId = game.data.id;
      console.log("saved new game ", gameId);
    });
  }
}

function getAllGames() {
  $.get('/games').done(function(data){
    var games = data.data;
    for(var game of games) {
      createGameButton(game);
    }
  });
}

function createGameButton(game) {
  var button = `<button id=${game.id}>Game ${game.id}</button>`;
  $("#games").append(button);
}

function previousGames() {
  clearPrevous();
  getAllGames();
}

function clearPrevous() {
  $("#games").empty();
}

function getGame(id) {
  $.get(`/games/${id}`).done(function(game) {
    var state = game.data.attributes.state
    turn = state.filter((v) => v !== "").length;
    gameId = game.data.id;
    setBoard(state);
  });
}

function saveListener() {
  $("#save").on('click', saveGame);
}

function tableCellListener() {
  $("td").on('click', function() {
    if (!gameOver()) {
      doTurn(this);
    }
  });
}

function previousListener() {
  $("#previous").on('click', previousGames);
}

function clearListener() {
  $("#clear").on('click', resetGame);
}

function gameButtons() {
  $("#games").on('click', 'button', function(e) {
    var id = $(e.target).attr('id');
    getGame(id);
  })
}

function attachListeners() {
  tableCellListener();
  saveListener();
  previousListener();
  clearListener();
  gameButtons();
}

$(function () {
  attachListeners();
});
