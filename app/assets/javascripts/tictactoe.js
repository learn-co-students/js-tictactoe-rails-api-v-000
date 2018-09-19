$(document).ready(function() {
  attachListeners()
})

turn = 0

currentGameId = 0

WIN_COMBINATIONS = [
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[2,4,6]
]

function player() {
  return turn % 2 === 0 ? "X" : "O";
}

function doTurn(square) {
  updateState(square);
  if (checkWinner()) {
    saveGame();
    resetBoard();
  } else if (turn === 9) {
      setMessage("Tie game.");
      saveGame();
      resetBoard();
  }
}

function updateState(square) {
  if (square.innerHTML === "") {
    $(square).text(player());
    turn ++;
  }
}

function setMessage(string) {
  $("#message").text(string);
}

function getBoard() {
  board = $("td").toArray();
  return board.map(function(square) { return square.innerHTML });
}

function resetBoard() {
  board = $("td").toArray();
  board.forEach(function(square) {square.innerHTML = ""});
  turn = 0
}

function checkWinner() {
  board = getBoard();
  winner = false;
  WIN_COMBINATIONS.forEach(function(combination){
    if(board[combination[0]] !== "" && board[combination[0]] === board[combination[1]] && board[combination[0]] === board[combination[2]]) {
      setMessage(`Player ${board[combination[0]]} Won!`)
      return winner = true;
    }
  });
  return winner
}

function attachListeners() {



  $("td").on("click", function() {
    if (!checkWinner()) {
      doTurn(this);
    }
  });

  $("#clear").on("click", function() {clearGame()});
  $("#save").on("click", function(){saveGame()});
  $("#previous").on("click", function(){previousGames()});
}

function clearGame() {
  board = $("td").toArray();
  board.forEach(function(square) {square.innerHTML = ""});
  turn = 0
  currentGameId = 0
}

function saveGame() {
  state = []
  for(let i = 0; i < getBoard().length;i++) {
    state.push(getBoard()[i]);
  }

  if (currentGameId === 0) {
     $.post("/games", {state: state}, function(game) {
       currentGameId = game.data.id;
     });

  } else {
    $.ajax({
      type: "PATCH",
      url: `/games/${currentGameId}`,
      data: {state: state}
    });
  }
}

function previousGames() {
  $("#games").html('');
  $.get("/games", function(data) {
    data["data"].forEach(function(game) {
      let currentGame = game["id"]
      $("#games").append(`<button class="previousGame" id="gameId-${currentGame}">Game #` + currentGame + '</button><br>')
      $("#gameId-" + currentGame).on("click", function() {
        $.get("/games/" + currentGame, function(data) { newBoard(data)})
      })
    })
  });
}



function newBoard(data) {
  currentGameId = data["data"]["id"]
  newestBoard = data["data"]["attributes"]["state"]
  turn = newestBoard.filter(word => word === "X" || word === "O").length  
  for (let i = 0; i < newestBoard.length; i++) {
    $("td")[i].innerHTML = newestBoard[i];
  };

}
