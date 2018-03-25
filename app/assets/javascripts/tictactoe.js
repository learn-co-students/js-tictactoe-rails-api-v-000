var turn = 0;
var gameId = 0;

var winning_combos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

function player() {
  return (turn % 2 === 0 ? "X" : "O");
}

function updateState(square) {
  var token = player();
  $(square).text(token);
}

function setMessage(string) {
  $('#message').text(string);
}

function checkWinner() {
  var board = [];
  var tds = $('td').toArray()
  tds.forEach(function(td) {
    board.push(td.innerHTML)
  })
  let winner = false
  winning_combos.forEach(function(combo) {
    if(board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]] && board[combo[0]] !== "") {
      if(board[combo[0]] === "X") {
        setMessage("Player X Won!");
      } else if(board[combo[0]] === "O"){
        setMessage("Player O Won!");
      }
      winner = true
    }
  });
  return winner
}

function doTurn(square) {
  updateState(square);
  turn++;
  if(turn === 9) {
    setMessage('Tie game.');
    saveGame();
    resetBoard();
  } else if(checkWinner()) {
    saveGame();
    resetBoard();
  }
}

function resetBoard() {
  $("td").empty();
  turn = 0;
  gameId = 0;
}

$(document).ready(function() {
  attachListeners();
  })

function attachListeners() {
  $('#clear').on('click', function() {
    resetBoard();
  });
  $('#save').on('click', function() {
    saveGame();
  });
  $('#previous').on('click', function() {
    previousGames();
  });
  $('td').on('click', function() {
    if($.text(this) === "" && !checkWinner()) {
      doTurn(this);
    }
  });
}

function saveGame() {
  var board = [];
  var tds = $('td').toArray();
  tds.forEach(function(td) {
    board.push(td.innerHTML)
  })
  if(gameId) {
    $.ajax({
      type: 'PATCH',
      url: `/games/${gameId}`,
      data: {state: board}
    })
  } else {
    $.post('/games', {state: board}).done(function(data) {
      gameId = data.data['id'];
    })
  }
}

function previousGames() {
  $("#games").empty();
  $.get('/games', function(games) {
    if(games.data.length) {
      games.data.forEach(makeButtons);
    }
  })
}

function makeButtons(game) {
  $('#games').append(`<button id="${game.id}">${game.id}</button><br>`);
  $(`#${game.id}`).on('click', function() {
    //console.log("clicked")
    reloadGame(this);
  })
}

function reloadGame(button) {
  $.get('/games/'+button.id, function(response) {
    var counter = 0;
    gameId = button.id;
    turn = 0
    response.data.attributes.state.forEach(function(el) {
      console.log($('td')[counter]);
      $('td')[counter].innerHTML = el;
      counter++;
      if(el === "X" || el === "O") {
        turn++;
      }
    })
  })
}
