$(function() {
  attachListeners();
});

var turn = 0;

function attachListeners() {

}

function doTurn() {

}

function player() {
  var move = "O";
  if (turn % 2 === 0) {
    move = "X";
  }
  return move;
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
