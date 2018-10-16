// Code your JavaScript / jQuery solution here
var turn = 0
var currentGame = 0

const winCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,4,8], [2,4,6], [0,3,6], [2,5,8], [1,4,7]]

$(document).ready(function() {
  attachListeners();
});

function attachListeners() {
  $("td").on('click', function() {
    if (!$.text(this) && !checkWinner()) {
     doTurn(this);
   }
  })

  $("#save").on('click', function() {saveGame()})
  $("#previous").on('click', function() {previousGames()})
  $("#clear").on('click', function() {resetBoard()})
}


function player() {
  if (turn % 2 === 0) {
    return "X"
  } else {
    return "O"
  }
}

function updateState(box) {
  var t = player()
  $(box).text(t);
}

function setMessage(string) {
  $("#message").text(string);
}

function checkWinner() {
  var board = {}
  var winner = false

  $('td').text(function(index, box) { board[index] = box});

  winCombinations.some(function (winArray) {
    if (board[winArray[0]] !== "" && board[winArray[0]] === board[winArray[1]] && board[winArray[1]] === board[winArray[2]]) {
      setMessage(`Player ${board[winArray[0]]} Won!`)
      return winner = true
    }
  })
  return winner
}

function doTurn(box) {
  updateState(box)
  turn ++
  if (checkWinner()) {
    saveGame()
    resetBoard()
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame()
    resetBoard()
  }
}

function resetBoard() {
  turn = 0
  currentGame = 0
  $('td').empty();
}

function saveGame() {
  var state = []
  var data;
  $('td').text(function(index, box) {
    state.push(box);
  });
  var data = {state: state}
  if (currentGame) {
    $.ajax({url: `/games/${currentGame}`, type: 'PATCH', data: data})
  } else {
    $.post('/games', data, function(newGame) {
      currentGame = newGame.data.id
      $("#games").append(`<button id="gameId-${newGame.data.id}">${newGame.data.id}</button><br>`)
      $("#gameId-" + newGame.data.id).on('click', function() {reloadGame(newGame.data.id)})
    });
  }

}

function previousGames() {
   $('#games').empty();
   $.get("/games", function(games) {
     if (games.data.length) {
       games.data.forEach(function(game) {
     $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
     $(`#gameid-${game.id}`).on('click', function() {reloadGame(game.id)});
     })
   }
  });
}

function reloadGame(game) {
  setMessage(" ")
  $.get("/games/" + game, function(game) {
    gameId = game["data"]["id"]
    currentGame = game["data"]["id"]
    turn = game["data"]["attributes"]["state"].length
    $('#games').empty();
    $('#games').append(`<button id="gameid-${gameId}">${gameId}</button><br>`);
    var s = game["data"]["attributes"]["state"]
    s.forEach(function(token, index) {
      $(`#${index}`).text(token)
    })
  })


}
