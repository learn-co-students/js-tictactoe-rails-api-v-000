
$(attachListeners);
var winCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
var currentGameId = 0;
var turn = 0;

function attachListeners() {
  //clicking on boards
  $("td").click(function(){
    if (!checkWinner()) { doTurn(this)};
  });

  $("#save").click(saveGame);
  $("#previous").click(previousGames);
  $("#clear").click(resetBoard);
}


function updateState(square){
	$(square).text(player());
}

function player() {
	if ( turn%2 === 1 ){
		return "O";
	} else {
		return "X";
	}
}

function setMessage(msg){
	$("div#message").html(msg);
}

function checkWinner(){
  var board = $("td");
  var won = false;
  var symbol = "";
  winCombos.some(function(winComboLoc){
    var winSquare1 = $(board[winComboLoc[0]]).html();
    var winSquare2 = $(board[winComboLoc[1]]).html();
    var winSquare3 = $(board[winComboLoc[2]]).html();
    var winCondition = (winSquare1 === "X" && winSquare2 === "X" && winSquare3 === "X") || (winSquare1 === "O" && winSquare2 === "O" && winSquare3 === "O")
    if (winCondition) {
      symbol = $(board[winComboLoc[0]]).html();
      return won = true;
    }
  });

  if (won) {setMessage(`Player ${symbol} Won!`)};
  return won;
}

function doTurn(square){
  if ($(square).html() === "") {
    updateState(square);
    turn++;
    if(checkWinner()) {
      saveGame();
      resetBoard();
    } else if (turn === 9) {
      setMessage("Tie game.");
      saveGame();
      resetBoard();
    }
  } else {
    // the spot has been played.
    alert ("square taken");
  }
}

function resetBoard() {
  $("td").empty();
  turn = 0;
  currentGameId = 0;
}

function saveGame() {
  var game_state = $("td").map(function() { return this.innerHTML
  }).get();
  //check if Game is new
  if (currentGameId === 0) {
    var posting = $.post("/games", {state: game_state});
    posting.done(function(game){
      currentGameId = game.data.id;
    })
  } else {
    $.ajax({
      url: `/games/${currentGameId}`,
      type: 'PATCH',
      data: {state: game_state},

      success : function(response, textStatus, jqXhr) {
        console.log("Game Successfully Patched!");
      },
      error : function(jqXHR, textStatus, errorThrown) {
          // log the error to the console
          console.log("The following error occured: " + textStatus, errorThrown);
      },
      complete : function() {
          console.log("Game Patch Ran");
      }
    });
  }
}


function previousGames() {
  $.get("/games", function(games_hash) {
    var games = games_hash["data"];

    // clear html and refill div#games
    $("div#games").html("");

    games.forEach(function (game){
      $("div#games").append(`<button id='${game["id"]}'>Game # ${game["id"]}</button>` + `Last Updated at: ${game["attributes"]["updated-at"]}<br>`);
      $("#" + game["id"]).click(loadGame);
    })

  })
}

function loadGame (){
  $.get("/games/" + this.id, function (game) {
    var state = game.data.attributes.state;
    currentGameId = game.data.id;
    turn = state.filter(function(square){ return square !== "";}).length;
    state.forEach(function(value, index) {
      $("td").get(index).innerHTML = value;
    })
  })
}