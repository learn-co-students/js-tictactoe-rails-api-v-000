var turn = 0;
var currentGame;
var winner = false;
var winningCombinations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
];

function fullBoard() {
  var currentBoard = checkBoard();
  for (i=0; i < currentBoard.length; i++)
  {
    if (currentBoard[i] === "") {
      return false;
    }
  }
  return true;
}

function message(str) {
  $("#message").html(str);
}

function checkWinner(currentBoard) {
  var currentBoard = checkBoard();
  for (i=0; i < winningCombinations.length; i++)
  {
    var winningCombo = winningCombinations[i];
    if ((currentBoard[winningCombinations[i][0]] === currentBoard[winningCombinations[i][1]]) && (currentBoard[winningCombinations[i][1]] === currentBoard[winningCombinations[i][2]]) && ((currentBoard[winningCombinations[i][2]] === "X") || (currentBoard[winningCombinations[i][2]] === "O"))){
      winner = true;
      message("Player " + player() + " Won!");
      turn = 0;
      return true;
    }
  }
  return false;
}

function isTie() {
  if ((winner === false) && fullBoard()){
    turn=0;
    message("Tie game");
    tie = true;
    resetBoard();
    return true;
  }
  return false;
}

function parseState(event) {
  return $(event.target).data("state").split(",")
}

function getGameId(event) {
  return $(event.target).data("gameid")
}

function previousGames() {
  var posting = $.getJSON('/games');
  posting.done(function(response) {
    // console.log(response);
    showGame(response.games);
  });
}

function showGame(values) {
  var dom = $();
  values.forEach(function(game) {
    dom = dom.add(show(game));
  });
  $("#games").html(dom);
}

function loadGame(state) {
  $("td").each(function(i) {
    $(this).text(state[i]);
  });
}

function show(elem) {
  return $('<li>', {'data-state': elem.state, 'data-gameid': elem.id, text: elem.id});
}

function saveGame(resetThisGame) {
  debugger;
  var currentBoardPositions = checkBoard();
  var url, method;
  if(currentGame) {
    url = "/games/" + currentGame
    method = "PATCH"
  } else {
    url = "/games"
    method = "POST"
  }
  $.ajax({
    url: url,
    method: method,
    dataType: "json",
    data: {
      game: {
        state: currentBoardPositions
      },
      success: function (data) {
        // alert(currentBoardPositions);
        if(resetThisGame) {
          // debugger;
          currentGame = undefined;
        } else {
          // debugger;
          currentGame = data.game.id;
        }
      }
    }
  });
}


function resetBoard() {

  var collection = $("tr").children('td');
  $.each(collection, function (index, value) {
    value.innerHTML = "";
  });

  currentGame = 0;
  turn = 0;

}

function checkBoard() {
  var currentBoardMarks = []
  $("td").each(function(i) {
    currentBoardMarks.push($(this).text())
  })
  // debugger;
  return currentBoardMarks;
}

function player() {
  if(turn % 2 === 0) {
    return "X";
  }
  else {
    return "O";
  }
}

function displayBoard(state) {
  // debugger;
  $("td").each(function(i) {
    // debugger;
    $(this).text(state[i]);
  });
}

function changeGame(state, id) {
  loadGame(state);
  currentGame = id;
  turn = findTurn(state);

}

function findTurn(state) {
  var turn = 0;
  state.forEach(function(item) {
    if(item != "") {
      turn += 1;
    }
  })
  return turn;
}

function attachListeners() {
  $("#save").click(function() {
    saveGame(true);
    resetBoard();
  });

  $("tbody").click(function(event) {
    // console.log(event);
    doTurn(event)
  });
  $("#previous").click(function() {
    previousGames();
  });

  $("#games").click(function(e) {
    var state = parseState(e);
    var gameid = getGameId(e);
    console.log(state);
    changeGame(state, gameid);
  });
}

function doTurn(event) {
  updateState(event);
  if (checkWinner() || isTie())
  {
    saveGame(true);
    resetBoard();
  }
  else
  {
    turn += 1;
  }
}

function updateState(event) {
  $(event.target).html(player());
}

$( document ).ready(function() {
  console.log( "ready!" );
  attachListeners();
});
