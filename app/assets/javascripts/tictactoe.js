// Code your JavaScript / jQuery solution here

$(document).ready(function() {
    attachListeners();
});

 const WIN_COMBO = [
 [0,1,2],
 [3,4,5],
 [6,7,8],
 [0,3,6],
 [1,4,7],
 [2,5,8],
 [0,4,8],
 [2,4,6] ]

 var turn = 0;
var gameId = 0;

 function player() {
  if (turn % 2) {
    return 'O';
  } else {
    return 'X';
  }
}

 function updateState(td) {
  var token = player();
  $(td).text(token);
}

 function setMessage(message) {
  $("div#message").text(message)
}

 function checkWinner() {
  var winner = false;
  var board = {};

   $("td").text((index, square) => board[index] = square);

   WIN_COMBO.forEach(function(win) {
    if (board[win[0]] === board[win[1]] && board[win[1]] === board[win[2]] && board[win[0]] !== "") {
      setMessage(`Player ${board[win[0]]} Won!`);
      return winner = true;
    }
  })
  return winner;
}

 function doTurn(square) {
  updateState(square);
  turn++;
  if (checkWinner()) {
    saveGame();
    clearGame();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    clearGame();
  }
}

 function attachListeners() {
  $("td").click(function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    };
  });
  $("#save").click(() => saveGame());
  $("#previous").click(() => previousGame());
  $("#clear").click(() => clearGame());
}

 function previousGame() {
  $("#games").empty();
    $.get('/games', function(games) {
      if (games.data.length) {
        games.data.forEach(function(game){
          $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
          $(`#gameid-${game.id}`).click(() => loadGame(game.id));
        });
      }
    });
  }

 function saveGame() {
  var state = []
  var gameData = {state: state}

   $('td').text((index, square) => state.push(square));

   if (gameId === 0) {
    $.post('/games', gameData, function(game) {
    gameId =  game.data.id;
    $('#games').append(`<p>${gameId}</p>`);
    });
  } else {
    $.ajax({
      type: 'PATCH',
      url: `/games/${gameId}`,
      data: gameData
      });
  };
}

 function loadGame(id) {
  currentGame = id
  $.get(`/games/${id}`, function(response) {
    gameId = response.data.id;
    let board = response.data.attributes.state;
    turn = board.join("").length;
    i = 0;
    board.forEach((e) => {$('td')[i].innerHTML = e, i++})
  });
}

 function clearGame() {
  $('td').empty();
  turn = 0;
  gameId = 0;
}
