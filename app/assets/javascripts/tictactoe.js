$(function() {
  attachListeners();
});



var turn = 0;
var currentGame = 0;


function attachListeners() {
  $("td").click(function() {
    var $td = $(this);
    var xCoord = $td.data('x');
    var yCoord = $td.data('y');
    doTurn(xCoord, yCoord);
  });
  previousGames();
  saveGame();
}

function doTurn(x, y) {
  updateState(x, y);
  turn++;
  checkWinner();
}

function player() {
  var move = "O"
  if(turn % 2 === 0) {
    move = "X"
  }

  return move
}

function updateState(x, y) {
  $("td[data-x='"+x+"'][data-y='"+y+"']").text(player);
}

function message(text) {
  $("#message").html(text)
}

function checkWinner() {
  var vertWin1 = [$("td[data-x='0'][data-y='0']").html(), $("td[data-x='0'][data-y='1']").html(), $("td[data-x='0'][data-y='2']").html()]
  var vertWin2 = [$("td[data-x='1'][data-y='0']").html(), $("td[data-x='1'][data-y='1']").html(), $("td[data-x='1'][data-y='2']").html()]
  var vertWin3 = [$("td[data-x='2'][data-y='0']").html(), $("td[data-x='2'][data-y='1']").html(), $("td[data-x='2'][data-y='2']").html()]
  var horizWin1 = [$("td[data-x='0'][data-y='0']").html(), $("td[data-x='1'][data-y='0']").html(), $("td[data-x='2'][data-y='0']").html()]
  var horizWin2 = [$("td[data-x='0'][data-y='1']").html(), $("td[data-x='1'][data-y='1']").html(), $("td[data-x='2'][data-y='1']").html()]
  var horizWin3 = [$("td[data-x='0'][data-y='2']").html(), $("td[data-x='1'][data-y='0']").html(), $("td[data-x='2'][data-y='2']").html()]
  var diagWin1 = [$("td[data-x='0'][data-y='0']").html(), $("td[data-x='1'][data-y='1']").html(), $("td[data-x='2'][data-y='2']").html()]
  var diagWin2 = [$("td[data-x='0'][data-y='2']").html(), $("td[data-x='1'][data-y='1']").html(), $("td[data-x='2'][data-y='0']").html()]

  var winningPossibilities = [vertWin1, vertWin2, vertWin3, horizWin1, horizWin2, horizWin3, diagWin1, diagWin2]

  var xWin = ["X", "X", "X"]
  var oWin = ["O", "O", "O"]

  var result = true

  $.each(winningPossibilities, function(index, setOfMoves) {
    if (setOfMoves.join() === xWin.join()) {
      message("Player X Won!")
      clearBoardAndStartOver();
    } else if (setOfMoves.join() === oWin.join()) {
      message("Player O Won!")
      clearBoardAndStartOver();
    } else if (turn === 9) {
      message("Tie game")
      clearBoardAndStartOver();
    } else {
      result = false
    }
  });
  return result
}

function clearBoardAndStartOver() {
  turn = 0;
  $("td").html("");
}

// Actions

function previousGames() {
  $("#previous").click(function() {
    $.get("/games", function(data) {
      var listOfGames = data["games"];
      $.each(listOfGames, function(i, game) {
        $("#games ul").append("<li>" +game.id+ "</li>")
      });
    });
  });
}

function currentMoves() {
  return [$("td[data-x='0'][data-y='0']").html(), $("td[data-x='1'][data-y='0']").html(), $("td[data-x='2'][data-y='0']").html(), $("td[data-x='0'][data-y='1']").html(), $("td[data-x='1'][data-y='1']").html(), $("td[data-x='2'][data-y='1']").html(), $("td[data-x='0'][data-y='2']").html(), $("td[data-x='1'][data-y='2']").html(), $("td[data-x='2'][data-y='2']").html()];
}
var count = 0;

function saveGame() {
  $("#save").click(function() {
    var currentValues = currentMoves();
    console.log(currentValues);
    if (count < 1) {
      var posting = $.post("/games", {game: {state: JSON.stringify(currentValues)}})
      posting.done(function(data) {
        // DO SOMETHING HERE
      });
      count++
    } else {
      console.log("This is the second time.")
    }
  });
}
