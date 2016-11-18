var counter = 0;
var turn = 0;
var currentGame;
var savedGames = [];
var saved = false;
var winningCombos = [
	[[0,0],[1,0],[2,0]],
	[[0,1],[1,1],[2,1]],
	[[0,2],[1,2],[2,2]],
	[[0,0],[1,1],[2,2]],
	[[0,0],[0,1],[0,2]],
	[[2,0],[2,1],[2,2]],
	[[1,0],[1,1],[1,2]],
	[[2,0],[1,1],[0,2]]];
var positions = [
	'[data-x="0"][data-y="0"]',
	'[data-x="1"][data-y="0"]',
	'[data-x="2"][data-y="0"]',
	'[data-x="0"][data-y="1"]',
	'[data-x="1"][data-y="1"]',
	'[data-x="2"][data-y="1"]',
	'[data-x="0"][data-y="2"]',
	'[data-x="1"][data-y="2"]',
	'[data-x="2"][data-y="2"]'];

$(document).ready(function() {
	attachListeners();
});

function attachListeners() {
	// click on one of the squares
	$('td').on('click', function(event) {
		var box = $(event.target)
		if(box.text() === "") {
			doTurn(event);
		};
	});

	// click for previous games
	$('#previous').on('click', function(event){
		getGames(event);
	});

	$('#save').on('click', function(event){
		event.preventDefault();
		if(counter == 0) {
			counter++;
			saveGame();	
		}
		else {
			updateGame(event);
		}
	});
}

function doTurn(event) {
	// update board with current player
	updateState(event);

	// determine winner
	// var check = checkWinner();
	if (checkWinner() || checkTie()) {
		//reset turn
		turn = 0;
		resetBoard();
	}
	else {
		turn++;		
	};
};

function updateState(event) {
	$(event.target).html(player());
};

function player() {
	if (turn % 2 === 0 || turn === 0)  {
		return "X";
	}
	else {
		return "O";
	}
}

function getGames(event) {
	$.get("/games").done(function(response){
    var savedGames = response.games;
    if (savedGames.length > 0) {
      $("#games").html("");
      response.games.forEach(function(game){
        $("#games").append("<li data-gameid=" + game.id + ">" + game.id + "</li>")
      });
      $("#games").on('click', function(event) {
      	// var gameid = $(event.target).data('gameid');
      	var match = savedGames.filter(function(obj) {
	        return obj.id == $(event.target).data('gameid');
	      });
	      gameState = match[0].state;
	      turn = 0;
	      saved = true;
		    for (var i = 0; i < positions.length; i++) {
		      $(positions[i]).html(gameState[i]);
		      if (gameState[i] != "") {
	          turn++;
	        }
		    }
      });
    }
  });
}

function message(string) {
	$('#message').html(string);
}

// function checkWinner() {
// 	var winner;
// 	for (var i = 0; i < winningCombos.length; i++) {
//     combo = winningCombos[i]; 
//     a = $(`[data-x="${combo[0][0]}"][data-y="${combo[0][1]}"]`).html();
//     b = $(`[data-x="${combo[1][0]}"][data-y="${combo[1][1]}"]`).html();
//     c = $(`[data-x="${combo[2][0]}"][data-y="${combo[2][1]}"]`).html();
//     if (a == "X" && b == "X" && c == "X") {
//       winner = "X";
//     } else if (a == "O" && b == "O" && c == "O") {
//       winner = "O";
//     } 
//   }
//   if (winner == "X") {
//     message("Player X Won!");
//     return true;
//   } else if (winner == "O") {
//     message("Player O Won!");
//     return true;
//   } else if (checkTie() != false ) {
//     message("Tie game");
//     return true;
//   } else {
//     return false;
//   }
// }

function checkWinner(){
  for(var i = 0; i < winningCombos.length; i++){

    if(currentWinner(winningCombos[i]) == true){
    message("Player " + player() + " Won!");
    return true;
  }
  }
  return false;
}

var currentWinner = function(event){
  for(var i = 0; i < event.length; i++){
    var winCombination = event[i]
    var x = winCombination[0]
    var y = winCombination[1]
    var location = $('[data-x="' + x + '"][data-y="' + y + '"]')
    if (currentplayerMatch(location)){
      return false;
    }
  }

  return true;
}

function checkTie() {
  var tie = true
  $("td").each(function(){
    if($(this).html().length <= 0){
      tie = false;
    }
  });
  if(tie) message("Tie game");
  return tie;
}

var currentplayerMatch = function(element) {
return (element.html() != player())
}

function currentValues() {
  var values = [];
  for (var i = 0; i < positions.length; i++) {
    values.push($(positions[i]).html());
  }
  return values;
}

function saveGame() {
  var game = {
        game: {
          state: currentValues()
        }
      }
  var posting = $.post('/games', game);
  posting.done(function(data) {
    currentGame = data["game"]["id"]
  });
}

function updateGame(over) {
	var game = {
    game: {
      state: currentValues()
    }
  }
  if (currentGame == 0) {
    currentGame++;
    }
  $.ajax({
    url : '/games/' + currentGame,
    type : 'PATCH',
    data : game
  });
}

function resetBoard() {
  console.log("resetting");
  counter = 0;
  turn = 0;
  saveGame();
  $('td').text("");
};


