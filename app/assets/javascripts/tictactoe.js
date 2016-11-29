$(function() {
  attachListeners();
});

var turn = 0;
var currentGame;
var counter = 0;
var winCombinations = [[[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], [[0,0],[1,1],[2,2]], [[0,0],[0,1],[0,2]], [[2,0],[2,1],[2,2]], [[1,0],[1,1],[1,2]], [[2,0],[1,1],[0,2]]];
var cells = ['[data-x="0"][data-y="0"]', '[data-x="1"][data-y="0"]', '[data-x="2"][data-y="0"]', '[data-x="0"][data-y="1"]', '[data-x="1"][data-y="1"]', '[data-x="2"][data-y="1"]', '[data-x="0"][data-y="2"]', '[data-x="1"][data-y="2"]', '[data-x="2"][data-y="2"]'];

function attachListeners() {
  $("td").click(function() {
    var xCoord = $(this).data('x');
    var yCoord = $(this).data('y');
    doTurn(xCoord, yCoord);
  });
  $('#previous').click(function() {getGames();});
  $('#save').click(function(event) {saveHandler(event);});
  $('#games').click(function(event) {loadGame(event);});
}

function doTurn(x, y) {
  updateState(x, y);
  if (checkWinner() === true) {
    resetGame();
  } else {
    turn++;
  }
}

function player() {
  var move = "O";
  if (turn % 2 === 0) {
    move = "X";
  }
  return move;
}

function updateState(x, y) {
  $("td[data-x='"+x+"'][data-y='"+y+"']").text(player);
}

function checkWinner() {
  var winner = "none";

  $.each(winCombinations, function(i, combo) {
    locA = $('[data-x='+combo[0][0]+'][data-y='+combo[0][1]+']').html();
    locB = $('[data-x='+combo[1][0]+'][data-y='+combo[1][1]+']').html();
    locC = $('[data-x='+combo[2][0]+'][data-y='+combo[2][1]+']').html();
    if (locA === "X" && locB === "X" && locC === "X") {
      winner = "X";
    } else if (locA === "O" && locB === "O" && locC === "O") {
      winner = "O";
    }
  });
  if (winner === "X") {
    message("Player X Won!");
    return true;
  } else if (winner === "O") {
    message("Player O Won!");
    return true;
  } else if (checkTie() === true) {
    message("Tie game");
    return true;
  } else {
    return false;
  }
}

function checkTie() {
  var result = true
  $.each(cells, function(i, cell) {
    value = $(cell).html();
    if (value !== "X" && value !== "O") {
      result = false;
    }
  });
  return result;
}

function message(string) {
  $("#message").text(string);
}

function resetGame() {
  turn = 0;
  counter = 0;
  saveGame();
  $("td").html("");
}

function getGames() {
  var getting = $.get('/games');

  getting.done(function(data) {
    var games = data["games"];
    var gameListItems = "";
    $.each(games, function(i, game) {
      gameListItems += `<li data-gameid="${game["id"]}">` + `${game["id"]}` + "</li>";
    });
    $('#games').html(gameListItems);
  });
}

function currentValues() {
  var values = [];
  $.each(cells, function(i, cell) {
    values.push($(cell).html());
  });
  return values;
}

function saveGame() {
  var game = {
        game: {
          state: JSON.stringify(currentValues())
        }
      };
  var posting = $.post('/games', game);
  posting.done(function(data) {
    currentGame = data["game"]["id"];
    console.log(data["game"]["id"], currentGame)
  });
}

function updateGame() {
  var game = {
        game: {
          state: JSON.stringify(currentValues())
        }
      };
  if (currentGame === 0) {
    currentGame++;
  }
  $.ajax({
    method: 'PATCH',
    url: '/games/' + currentGame,
    data: game
  }).done(function(data) {
    console.log("updated game: ", data["game"]["id"], currentGame)
  });
}

function saveHandler() {
  if (counter === 0) {
    counter++;
    saveGame();
  } else {
    updateGame();

  }
}

function loadGame() {
  var gameId = $(event.target).data("gameid");
  var getting = $.get('/games/' + gameId);
  getting.done(function(data) {
    var gameValues = $.parseJSON(data["game"]["state"]);
    $.each(cells, function(i, cell) {
      $(cell).html(gameValues[i]);
    });
  });
}
// var turn = 0;
// var currentGame = 0;
//
//
// function attachListeners() {
//   $("td").click(function() {
//     var $td = $(this);
//     var xCoord = $td.data('x');
//     var yCoord = $td.data('y');
//     doTurn(xCoord, yCoord);
//   });
//   previousGames();
//   saveGame();
// }
//
// function doTurn(x, y) {
//   updateState(x, y);
//   turn++;
//   checkWinner();
// }
//
// function player() {
//   var move = "O"
//   if(turn % 2 === 0) {
//     move = "X"
//   }
//
//   return move
// }
//
// function updateState(x, y) {
//   $("td[data-x='"+x+"'][data-y='"+y+"']").text(player);
// }
//
// function message(text) {
//   $("#message").html(text)
// }
//
// function checkWinner() {
//   var vertWin1 = [$("td[data-x='0'][data-y='0']").html(), $("td[data-x='0'][data-y='1']").html(), $("td[data-x='0'][data-y='2']").html()]
//   var vertWin2 = [$("td[data-x='1'][data-y='0']").html(), $("td[data-x='1'][data-y='1']").html(), $("td[data-x='1'][data-y='2']").html()]
//   var vertWin3 = [$("td[data-x='2'][data-y='0']").html(), $("td[data-x='2'][data-y='1']").html(), $("td[data-x='2'][data-y='2']").html()]
//   var horizWin1 = [$("td[data-x='0'][data-y='0']").html(), $("td[data-x='1'][data-y='0']").html(), $("td[data-x='2'][data-y='0']").html()]
//   var horizWin2 = [$("td[data-x='0'][data-y='1']").html(), $("td[data-x='1'][data-y='1']").html(), $("td[data-x='2'][data-y='1']").html()]
//   var horizWin3 = [$("td[data-x='0'][data-y='2']").html(), $("td[data-x='1'][data-y='0']").html(), $("td[data-x='2'][data-y='2']").html()]
//   var diagWin1 = [$("td[data-x='0'][data-y='0']").html(), $("td[data-x='1'][data-y='1']").html(), $("td[data-x='2'][data-y='2']").html()]
//   var diagWin2 = [$("td[data-x='0'][data-y='2']").html(), $("td[data-x='1'][data-y='1']").html(), $("td[data-x='2'][data-y='0']").html()]
//
//   var winningPossibilities = [vertWin1, vertWin2, vertWin3, horizWin1, horizWin2, horizWin3, diagWin1, diagWin2]
//
//   var xWin = ["X", "X", "X"]
//   var oWin = ["O", "O", "O"]
//
//   var result = true
//
//   $.each(winningPossibilities, function(index, setOfMoves) {
//     if (setOfMoves.join() === xWin.join()) {
//       message("Player X Won!")
//       clearBoardAndStartOver();
//       startNewGame();
//     } else if (setOfMoves.join() === oWin.join()) {
//       message("Player O Won!")
//       clearBoardAndStartOver();
//       startNewGame();
//     } else if (turn === 9) {
//       message("Tie game")
//       clearBoardAndStartOver();
//     } else {
//       result = false
//     }
//   });
//   return result
// }
//
// function clearBoardAndStartOver() {
//   turn = 0;
//   $("td").html("");
// }
//
// function startNewGame() {
//   clearBoardAndStartOver();
//   timesSaveClicked = 0;
//   timesPreviousClicked = 0;
//   var currentValues = currentMovesOnBoard();
//   var posting = $.post("/games", {game: {state: JSON.stringify(currentValues)}})
//   posting.done(function(data) {
//     currentGame = data["game"]["id"]
//     console.log(currentGame, data["game"]["state"], "This is a new game.")
//   });
// }
//
// var timesPreviousClicked = 0;
//
// function previousGames() {
//   $("#previous").click(function() {
//     $.get("/games", function(data) {
//       if (data["games"].length === 0) {
//         console.log("There aren't any previous games.")
//       } else if (data["games"].length >= 1 && timesPreviousClicked === 0) {
//         timesPreviousClicked++
//         var listOfGames = data["games"];
//         $.each(listOfGames, function(i, game) {
//           $("#games").append("<li>" +game.id+ "</li>")
//         });
//       } else if (data["games"].length >= 1 && timesPreviousClicked === 1) {
//         $("#games").append("<li>" +currentGame+ "</li>")
//       }
//     })
//   });
// }
//
// function currentMovesOnBoard() {
//   return [$("td[data-x='0'][data-y='0']").html(), $("td[data-x='1'][data-y='0']").html(), $("td[data-x='2'][data-y='0']").html(), $("td[data-x='0'][data-y='1']").html(), $("td[data-x='1'][data-y='1']").html(), $("td[data-x='2'][data-y='1']").html(), $("td[data-x='0'][data-y='2']").html(), $("td[data-x='1'][data-y='2']").html(), $("td[data-x='2'][data-y='2']").html()];
// }
//
// var timesSaveClicked = 0;
//
// function saveGame() {
//   $("#save").click(function() {
//     var currentValues = currentMovesOnBoard();
//     if (timesSaveClicked < 1) {
//       var posting = $.post("/games", {game: {state: JSON.stringify(currentValues)}})
//       posting.done(function(data) {
//         currentGame = data["game"]["id"]
//         console.log(currentGame, data["game"]["state"])
//       });
//       timesSaveClicked++
//     } else {
//       currentValues = currentMovesOnBoard();
//       if (currentGame === 0) {
//         currentGame++
//       }
//       $.ajax({
//         method: "PATCH",
//         url: "/games/" + currentGame,
//         data: {game: {state: JSON.stringify(currentValues)}}
//       }).done(function(data) {
//         console.log("Updated game " + currentGame)
//       });
//     }
//   });
// }
