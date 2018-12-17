// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var currentGame = 0;

var player = () => turn % 2 ? 'O' : 'X';
// If turn count returns a remainder of 0 it's X's turn else it's O's turn

function updateState(square) {
  // Update the players move on the specific location on the board
  var token = player();
  $(square).text(token);
}

function setMessage(string) {
  // Adds input message to the #message div
  $('#message').text(string)
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);
  // Fills the board hash with the locations of X and O

  WINNING_COMBOS.some(function(combo) {
    // .some()  method tests whether at least one element in the array passes the test implemented by the provided funciton
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

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

function loadGame(gameId) {
  $.get(`/games/${gameId}`, function(response){
    currentGame = response.data.id;
    gameArray = response.data.attributes.state;
    turn = gameArray.join("").length
    var index = 0
    for (var y = 0; y < 3; y ++) {
      for (var x = 0; x < 3; x ++) {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = gameArray[index];
        index += 1;
      }
    }
  })
}
