// Code your JavaScript / jQuery solution here
var turn = 0;
var currentGame = 0;
var WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

$(document).ready(function() {
  attachListeners();
})

function player() {
  if (turn % 2 == 0) {
    return "X";
  } else {
    return "O";
  }
}



function updateState (square) {
  $(square).text(player());
}

function setMessage(msg) {
  $("div#message").html(msg);
}

function checkWinner() {
  var won = false;
  var board = {};
  $('td').text((index, square) => board[index] = square);
  WINNING_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      var winner = board[combo[0]]
      setMessage(`Player ${winner} Won!`);
      return won = true;
    }
  });

  return won;
}

function setMessage(message) {
  $("#message").html(message)
}

function clearBoard() {
  $("td").empty();
  turn = 0;
  currentGame = 0;
}


function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    saveGame();
    clearBoard();
  } else if (turn === 9) {
    saveGame();
    setMessage("Tie game.");
    clearBoard();
  }
}

function saveGame() {
  var state = Array.from($("td"), td => td.innerText)
  var params = { state: state }
  if (currentGame) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGame}`,
      data: params
    });
  } else {
    $.post("/games", params, function(resp) {
      currentGame = resp.data.id;
      setMessage("Game saved.");

    })
  }
}

function getPreviousGames() {
  $("div#games").html('');
  $.get('/games', function(games) {
    if (games.data.length > 0) {
      games.data.forEach(function(game){
        var id = game["id"];
        var button = '<button id="game-' + id + '">' + id + '</button>'
        $("div#games").append(button);
        $(`#game-${id}`).on('click', () => loadGame(id));
      });
    }
  })
}

function attachListeners() {
  $("td").on("click", function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });

  $("button#save").on('click', function(){
    saveGame();
  });

  $("button#previous").on('click', function() {
    getPreviousGames();
  })

  $("button#clear").on('click', function() {
    clearBoard();
  })
}

function loadGame(id){
  $.get(`/games/${id}`, function(game) {
    state = game.data.attributes.state
    squares = document.querySelectorAll("td")
    currentGame = id;
    turn = state.join("").length;
    var i = 0;
    squares.forEach(function(square) {
      square.innerHTML = state[i];
      i++;
    })
    // var i = 0;
    // for (var i = 0; i < state.length; i++) {
    // 	squares[i].innerText = state[i];
    //   debugger;
    //  }
  })
}
