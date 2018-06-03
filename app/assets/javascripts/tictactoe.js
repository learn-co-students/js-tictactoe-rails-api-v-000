var turn = 0;
var currentGameId;

function player() {
  if (turn % 2 == 0){
    return 'X';
  } else {
    return 'O';
  }
}

function updateState(element) {
  element.innerHTML = player();
}

function setMessage(string) {
  $("#message")[0].innerHTML = string;
}

function checkWinner() {
  if ($("td")[0].innerHTML != "" && $("td")[0].innerHTML == $("td")[1].innerHTML && $("td")[1].innerHTML == $("td")[2].innerHTML) { //Row 1
    setMessage(`Player ${$("td")[0].innerHTML} Won!`);
    return true;
  } else if ($("td")[3].innerHTML != "" && $("td")[3].innerHTML == $("td")[4].innerHTML && $("td")[4].innerHTML == $("td")[5].innerHTML) { //Row 2
    setMessage(`Player ${$("td")[3].innerHTML} Won!`);
    return true;
  } else if ($("td")[6].innerHTML != "" && $("td")[6].innerHTML == $("td")[7].innerHTML && $("td")[7].innerHTML == $("td")[8].innerHTML) { //Row 3
    setMessage(`Player ${$("td")[6].innerHTML} Won!`);
    return true;
  } else if ($("td")[0].innerHTML != "" && $("td")[0].innerHTML == $("td")[4].innerHTML && $("td")[4].innerHTML == $("td")[8].innerHTML) { //Diagonal 1
    setMessage(`Player ${$("td")[0].innerHTML} Won!`);
    return true;
  } else if ($("td")[2].innerHTML != "" && $("td")[2].innerHTML == $("td")[4].innerHTML && $("td")[4].innerHTML == $("td")[6].innerHTML) { //Diagonal 2
    setMessage(`Player ${$("td")[2].innerHTML} Won!`);
    return true;
  } else if ($("td")[0].innerHTML != "" && $("td")[0].innerHTML == $("td")[3].innerHTML && $("td")[3].innerHTML == $("td")[6].innerHTML) { //Col 1
    setMessage(`Player ${$("td")[0].innerHTML} Won!`);
    return true;
  } else if ($("td")[1].innerHTML != "" && $("td")[1].innerHTML == $("td")[4].innerHTML && $("td")[4].innerHTML == $("td")[7].innerHTML) { //Col 2
    setMessage(`Player ${$("td")[1].innerHTML} Won!`);
    return true;
  } else if ($("td")[2].innerHTML != "" && $("td")[2].innerHTML == $("td")[5].innerHTML && $("td")[5].innerHTML == $("td")[8].innerHTML) { //Col 3
    setMessage(`Player ${$("td")[2].innerHTML} Won!`);
    return true;
  } else {
    return false;
  }
}

function doTurn(element) {
  updateState(element);

  if (checkWinner() == true) {
    saveGame();
    clearBoard();
  } else if (turn == 8 && checkWinner() == false) {
    setMessage("Tie game.")
    saveGame();
    clearBoard();
  } else {
    turn += 1;
  }
}

function saveGame() {
  var boardArray = []
  //creates an array based on current board state.
  for (var i = 0; i < 9; i++) {
    boardArray.push($("td")[i].innerHTML);
  }

  if (currentGameId) {
    //updates an existing game
    $.ajax({
      type: 'PATCH',
      url: `/games/${currentGameId}`,
      data: { state: boardArray }
    });
  } else {
    //creates a new persisted game
    $.post("/games", { state: boardArray }, function(game) {
      currentGameId = game.data.id;
    });
  }
}

function previousGames() {
  //requests json of persisted games
  $.get("/games", function(data) {
    //clears displayed game buttons
    $("#games").empty();
    //adds a button for each game
    for(var i = 0; i < data.data.length; i++) {
      $("#games").append('<button name="BUTTON" class="game_button" data-id="' + data.data[i].id + '" data-state="' + data.data[i].state + '">Game ' + (i+1) + '</button>');
    }
    loadGame();
  }, "json");
}

function clickSquare() {
  $("td").on("click", function() {
    if (!$.text(this) && !checkWinner()) {
      doTurn(this);
    }
  });
}

function clearBoard() {
  $("td").empty();
  turn = 0;

  if (currentGameId) {
    currentGameId = "";
  };
}

function loadGame() {
  $("button").on("click", function() {
    $.get(`/games/${this.attributes["data-id"].value}`, function(game) {
      boardArray = game.data.attributes.state;
      currentGameId = game.data.id;
      for (var i = 0; i < 9; i++) {
        $("td")[i].innerHTML = boardArray[i];
      }
      turn = boardArray.join('').length;
    });
  });
}

function attachListeners() {
  clickSquare();
  $("#previous").on("click", () => previousGames());
  $("#save").on("click", () => saveGame());
  $("#clear").on("click", () => clearBoard());
}

$(document).ready(function() {
  attachListeners();
});

