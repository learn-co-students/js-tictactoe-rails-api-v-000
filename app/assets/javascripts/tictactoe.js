$(document).ready(function() {
  attachListeners();
});
var turn = 1;
var currentGame = 0;

var attachListeners = function() {

  $("td").click(function(event) {
    doTurn(event);
  });

  $("#previous").click(function() {
    getAllGames();
  });

  $("#save").click(function() {
    saveGame();
  });
}

var doTurn = function(event) {
  var cell = event.target;
  if($(cell).text() === "") {
    updateState(event);
    checkWinner();
    turn++;
  }
}

var updateState = function(event) {
  var cell = event.target;
  $(cell).text(player());
}

var player = function() {
  var token = "X"
  if(turn % 2 === 0) {
    token = "O"
  }
  return token;
}

var checkWinner = function() {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  var state = $("td").map(function(i,td) {
               return $(td).text()
             }).toArray();
  var won = false;
  winningCombos.forEach(function(combo) {
    var currentCombo = [state[combo[0]], state[combo[1]], state[combo[2]]];
      if((currentCombo[0] === "X" && currentCombo[1] === "X" && currentCombo[2] === "X") || (currentCombo[0] === "O" && currentCombo[1] === "O" && currentCombo[2] === "O")) {
        message("Player " + player() + " Won!");
        resetGame();
        won = true;
      }
  });

  if(won === false && state.every(function(token){
    return token === "X" || token === "O";
  })){
    message("Tie game");
    resetGame();
  }
  return won;
}

function message(string) {
  $("#message").text(string);
}

var resetGame = function() {
  saveGame();
  resetBoard();
  turn = 0;
  currentGame = 0;
}

var resetBoard = function() {
  $("td").each(function() {
    $("#id").text("");
    $(this).html("");
  });
}

var getAllGames = function() {
  $.get("/games", function(data) {
    if(data["games"].length !== 0) {
      var gamesHTML = '';
      data["games"].forEach(function(game){
        gamesHTML += '<li onclick="loadGame(this);">';
        gamesHTML += game["id"].toString();
        gamesHTML += '</li>';
      });
      $("#games").html(gamesHTML);
    }
  });

  $("li").click(function() {
    loadGame();
  });
}

var saveGame = function() {
  var state = $("td").map(function(i,td) {
               return $(td).text()
             }).toArray();
  currentGame = $("#id").text();
  console.log(currentGame);
  if(currentGame == 0){
    var posting = $.post("/games", {"game": { "state": state }}, function(data) {
       $("#id").text(data["game"]["id"])
    });
  } else {
    $.ajax({
      url: '/games/' + currentGame,
      type: 'PATCH',
      data: { "game": {"state": state }}
    });
  }
}

var loadGame = function(listItem) {
  var id = listItem.innerText;
  currentGame = id;
  $("#id").text(id);
  $.get("/games", function(data){
    var game = data["games"][id-1];
    $("td").each(function(index, cell){
      cell.innerHTML = game["state"][index];
    })
    $("#id").text(data["game"]["id"]);
    var numOfBlankCells = $("td").toArray().filter(function(cell){
      return cell.innerHTML === "";
    }).length
    turn = 10 - numOfBlankCells;
  })
}
