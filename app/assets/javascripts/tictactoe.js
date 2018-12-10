// Code your JavaScript / jQuery solution here
var turn = 0

var currentGame = 0

var winningCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

function player() {
  if (turn % 2 === 0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(element) {
  var token = player();
  $(element).text(token);
}

function setMessage(string) {
  $("div#message").text(string);
}

function checkWinner() {
  var board = {}
  $("td").text((index, square) => board[index] = square);
  var winner = false
  winningCombinations.some(function(combo){
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      winner = true;
      return winner;
    }
  })
  return winner;
}

function doTurn(element) {
  updateState(element);
  turn += 1;
  if (checkWinner()) {
    saveGame();
    clearBoard();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    clearBoard();
  }
}

function clearBoard() {
  $("td").empty();
  turn = 0;
  currentGame = 0;
}

$(document).ready(function(){
  attachListeners();
})

function attachListeners() {
  $("td").click(function(){
    if ($(this).text() === "" && !checkWinner()) {
      doTurn(this);
    }
  });

  $("#previous").click(function() {
    $.get("/games", function(response){
      $("#games").html("");
      response.data.forEach(function(element){
        var buttonSetup = `<button id="button-${element.id}">${element.id}</button><br>`;
        $("#games").append(buttonSetup);
        $(`#button-${element.id}`).click(function(){
          loadGame(element.id)
        });
      });
    })
  })

  $("#save").click(function() {
    saveGame();
  });

  $("#clear").click(function() {
    clearBoard();
  });
}

function saveGame() {
  var gameStatus = []
  $("td").text((index, square) => gameStatus.push(square))
  var gameData = { state: gameStatus }
  if (currentGame) {
    $.ajax({
      method: "PATCH",
      url: `/games/${currentGame}`,
      data: gameData
    });
  } else {
    $.post("/games", gameData, function(game){
      currentGame = game.data.id;
      var buttonSetup = `<button id="button-${game.data.id}">${game.data.id}</button><br>`;
      $("#games").append(buttonSetup);
      $(`#button-${game.data.id}`).click(function() {
        loadGame(game.data.id)
      });
    });
  }
}

function loadGame(gameId) {
  $.get(`/games/${gameId}`, function(response){
    currentGame = response.data.id;
    gameArray = response.data.attributes.state;
    turn = gameArray.join("").length
    debugger
    var index = 0
    for (var y = 0; y < 3; y ++) {
      for (var x = 0; x < 3; x ++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = gameArray[index];
        index += 1;
      }
    }
  })
}
