var currentGame;
var tableHash = {
  "0,0": 0,
  "1,0": 1,
  "2,0": 2,
  "0,1": 3,
  "1,1": 4,
  "2,1": 5,
  "0,2": 6,
  "1,2": 7,
  "2,2": 8
}
var winCombinations =  [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ];

var turn = 0;
var board = ["","","","","","","","",""];

function player() {
  if (turn%2===0) {
    return "X";
  } else {
    return "O";
  }
}

function updateState(cellElement) {
  cell = cellElement.data("x") + "," + cellElement.data("y");
  board[tableHash[cell]] = player(turn);
  cellElement.text(player(turn));
}

function checkWinner() {
  var isWinner = winCombinations.map(function(combination) {
    if (board[combination[0]] !== "" && board[combination[0]] === board[combination[1]] && board[combination[0]] === board[combination[2]]) {
      return combination;
    }
  });
  var winner = isWinner.filter(function(n) { return n != undefined } )[0];

  if (winner !== undefined) {
    message("Player " + board[winner[0]] + " Won!");
    return true;
  } else {
    return false;
  }
}

function boardSize() {
  return $('td').text().length;
}

function checkTie() {
  if (boardSize() === 9) {
    message("Tie game");
    return true;
  }
}

function resetGame() {
  $("table").removeAttr('data-id');
  $('td').text("");
  turn = 0;
  board = ["","","","","","","","",""];
  currentGame = 0;
}

function message(str) {
  $("#message").html(str);
}

function doTurn(cellElement) {
  updateState(cellElement);
  if (checkWinner() || checkTie()) {
    saveHandler(true);
    resetGame();
  } else {
    turn ++;
  }
}

function attachListeners() {
  tableListener();
  saveListener();
  previousListener();
  gamesListener();
}

function tableListener() {
  $("td").on("click", function(e) {
    thisValue = $(this).text();

    if (thisValue === "") {
      doTurn($(this));
    }
  });
}

function saveListener() {
  $("#save").on("click", function(e) {
    saveHandler();
  });
}

function saveHandler(resetThisGame) {
  var method,url;
  var gameId = $('table').data('id');

  if (gameId) {
    method = "PATCH"
    url = "/games/" + gameId;
  } else {
    method = "POST"
    url = "/games"
  }

  $.ajax({
    url: url,
    type: method,
    dataType: 'json',
    data: {
      'game': {
          'state': board
      }
    },
    success: function(data) {
      if(resetThisGame) {
        currentGame = undefined;
      } else {
        currentGame = data.game.id;
        $("table").attr('data-id', currentGame);
      }
    }
  });
}

function previousListener() {
  $("#previous").on("click", function(e) {
    getAllGames();
  });
}

function gamesListener() {
  $("#games").on("click", function(e) {
    $.get("/games/" + e.target.dataset.gameid , function(data) {
      setBoard(data["game"]);
    });
  });
}

function processBoard(board) {
  return board.slice(2,-2).split(",").map(function(element) {
    var value = element.match(/[XO]/);

    if (value !== null) {
      return value[0]
    } else {
      return "";
    }
  });
}

function setBoard(newGame) {
  var newBoard = processBoard(newGame["state"]);

  board = newBoard;
  currentGame = newGame.id;
  $("table").attr('data-id',currentGame)

  showBoard(board);
}

function showBoard(board) {
  $("td").each(function(index) {
    $(this).text(board[index]);
  });

  turn = boardSize();
}

function getAllGames() {
  $.get("/games", function(data) {
    displayGames(data["games"]);
  });
}

function displayGames(games) {
  var el = [];
  games.forEach(function(game) {
    el.push("<li data-gameid='" + game.id + "' data-state='" + game.state + "'>" + game.id + "</li>");
  });

  $("#games").html(el);
}

$(function(){
  attachListeners();
});
