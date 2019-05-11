$(document).ready(attachListeners);


 function attachListeners () {
  $("td").on("click", function() {
    if($(this).is(':empty') && !checkWinner()) {
    doTurn(this);
    }
  });

   $("button#save").on("click", () => saveGame());
  $("button#previous").on("click", () => previousGame());
  $("button#clear").on("click", () => clearGame());
}



 var WIN_COMBOS =  [[0,1,2],
                   [3,4,5],
                   [6,7,8],
                   [0,3,6],
                   [1,4,7],
                   [2,5,8],
                   [0,4,8],
                   [6,4,2]];
var turn = 0;
let gameNumber = 0;

 function player() {
  return (turn % 2 === 0 ? "X" : "O");
}

 function updateState(choice) {
  $(choice).text(player());
}

 function setMessage(m) {
  $("div#message").text(m);
}


 function checkWinner() {
  let board = [];
  let winner = false;
  $("td").text(function(index, token){
    board[index] = token;
  });

   WIN_COMBOS.forEach(function(combo){
    if (
      board[combo[0]]=== board[combo[1]] &&
      board[combo[1]]=== board[combo[2]] &&
      board[combo[0]]!== ""
    ){
      setMessage(`Player ${board[combo[0]]} Won!`);
      winner = true;
    }
  });
    return winner;
}

 function doTurn(choice) {
  updateState(choice);
  turn += 1;

   if (checkWinner()){
    saveGame();
    clearGame();
  } else if (turn === 9) {
    setMessage("Tie game.");
    saveGame();
    clearGame();
  }
}

 function currentBoard() {
  let state = [];
  $("td").text((index, square) => {
    state.push(square);
  });
  return state;
}

 function saveGame() {
  let gameData = { state: currentBoard() };
  if (gameNumber === 0) {
    $.post("/games", gameData, game => {
      gameNumber = game.data.id;
    });
  } else {
    $.ajax({
      type: "PATCH",
      url: `/games/${gameNumber}`,
      data: "gameData"
    });
  }
}

 function clearGame() {
  $('td').empty();
  turn = 0;
  gameNumber = 0;
}

 function previousGame() {
  $("#games").text("");
  $("#message").text("");
  $.get("/games", gamesAll => {
    gamesAll.data.forEach(game => {
      $("#games").append(
        `<button id="gameid-${game.id}">${game.id}</button><br>`
      );
      $(`#gameid-${game.id}`).on("click", () => loadGame(game.id));
    });
  });
}

 function loadGame(gameId) {
  $("#message").text("");
  $.get(`/games/${gameId}`).done(response => {
    gameNumber = response.data.id;
    let state = response.data.attributes.state;
    turn = state.join("").length;
    let i = 0;
    state.forEach(e => {
      $("td")[i].innerHTML = e;
      i++;
    });
  });
}
