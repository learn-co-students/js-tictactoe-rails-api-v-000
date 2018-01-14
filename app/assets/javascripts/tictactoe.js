// Code your JavaScript / jQuery solution here


var turn = 0;
var current_game = 0;
var WINNING_COMBOS = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
                      [0, 3, 6], [1, 4, 7], [2, 5, 8],
                      [0, 4, 8], [2, 4, 6]];


function player() {
  return (window.turn % 2 === 0) ? 'X' : 'O'
}

function updateState(cell) {
  cell.innerHTML = player();
  turn++;
}

function setMessage(message) {
  $("div#message").text(message)
}

function checkWinner() {
  var squares = $("td");
  var return_value = false;

  return WINNING_COMBOS.some(function(combo) {
    if ((squares[combo[0]].innerHTML !== "") && (squares[combo[0]].innerHTML === squares[combo[1]].innerHTML)
    && (squares[combo[0]].innerHTML === squares[combo[2]].innerHTML)) {
      var winner = squares[combo[0]].innerHTML;
      setMessage(`Player ${winner} Won!`);
      return_value = true;
      return return_value;
    }
  })
}

function resetBoard() {
  turn = 0;
  current_game = 0;
  document.querySelectorAll('td').forEach(function(square) {
    square.innerHTML = ""
  })
}

function doTurn(cell) {
  updateState(cell);
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
    setMessage('Tie game.');
    saveGame();
    resetBoard();
  }
}

$(function(){
  attachListeners();
})

function attachListeners() {
  $('td').click(function() {
    if (this.innerHTML === "" && !checkWinner()) {
      doTurn(this);
    }
  });

  $("button#save").click(function() {
    saveGame();
  });

  $("button#previous").click(function() {
    previousGame();
  });

  $("button#clear").click(function() {
    resetBoard();
  });

}

function previousGame() {
  $("#games").html("")
  $.get("/games", function(games){
    if (games.data.length) {addGamesButtons(games)};
  })
}

function addGamesButtons(games) {
  var gamesHTML = "";
  games.data.forEach(function(game) {
    gamesHTML += "<button id='" + game.id + "'>" + game.id + "</button><br>"
  })
  $("div#games").append(gamesHTML);
  $("div#games > button").click(function() {
    reloadGame(this.id);
  })
}

function reloadGame(id) {
  $.get("/games/" + id, function(game) {
    var board = game.data.attributes.state
    var cells = document.querySelectorAll('td')
    turn = 0;
    current_game = game.data.id
    for (var i = 0; i < 9; i++) {
      cells[i].innerHTML = board[i]
      if (board[i] !== "") { turn++ }
    }
  })
}

function saveGame() {
  var boardArray = []
  document.querySelectorAll("td").forEach(function(td) {
    boardArray.push(td.innerHTML);
  })
  var board = {state: boardArray}
  if (current_game === 0) {
    $.post("/games", board)
    .done(function(game){
      current_game = game.data.id
    })
  } else {
    updateGame(board, current_game);
  }
}

function updateGame(squares, current_game) {
  $.ajax({
    url: `/games/${current_game}`,
    method: 'patch',
    data: squares
  })
}
