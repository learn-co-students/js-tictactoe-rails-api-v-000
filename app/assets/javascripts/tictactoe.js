var turn = 0;
var currentGame = 0;
var savedGames = [];
var saved = false;
var winningCombos = [
	[0,1,2],
	[3,4,5],
	[6,7,8],
	[0,3,6],
	[1,4,7],
	[2,5,8],
	[0,4,8],
	[2,4,6],
]
var position = { 0: [0,0], 1:[1,0], 2:[2,0], 3:[0,1], 4:[1,1], 5:[2,1], 6:[0,2], 7:[1,2], 8:[2,2]};
var game = { state: ["", "", "", "", "", "", "", "", ""], id: undefined };

$(document).ready(function() {
	attachListeners();
});

function attachListeners() {
	// click on one of the squares
	$('td').on('click', function() {
		doTurn(event);
	});

	// previous games
	$('#previous').on('click', function(){
		$.ajax({
      method: "get",
      url: "/games"
    }).success(function(response){
      var savedGames = response.games;
      if (savedGames.length > 0) {
        $("#games").html("");
        response.games.forEach(function(game){
          $("#games").append("<li data-gameid=" + game.id + ">" + game.id + "</li>")
        });
        $("#games li").on('click', function() {
        	game.id = parseInt(event.target.dataset.gameid);
        	console.log(game.id);
		      var match = savedGames.filter(function(obj) {
		        return obj.id == game.id;
		      });
		      game.state = match[0].state;
		      turn = 0;
		      saved = true;
		      for (var slot in game.state) {
		        $('[data-x=' + position[slot][0] + '][data-y=' + position[slot][1] +']').text(game.state[slot]);
		        if (game.state[slot] != "") {
		          turn++;
		        }
		      }
        });
      }
    });
		// $.get("/games").done(function(data) {
		// 	if (data["games"].length > 0){
		// 		$("#games").html("");
		// 		for(var l = 0, len = data["games"].length; l < len; l++) {
		// 			$('#games').append("<li data-gameid=" + data["games"][l].id + ">" + data["games"][l].id + "</li>");
		// 		};
		// 	};
		// 	$("#games li").on('click', function() {
		// 		var gameid = parseInt(event.target.dataset.gameid);
		// 		console.log(data["games"][gameid - 1]);
		// 		state = data["games"][gameid - 1]["state"];
	 //      turn = 0;
	 //      for (var space in state) {
	 //        $('[data-x=' + position[space][0] + '][data-y=' + position[space][1] +']').text(state[space]);
	 //        if (state[space] != "") {
	 //          turn++;
	 //        }
	 //      }
		// 	});
		// });
	});

	// listen for save
	$('#save').on('click', function(){
		//this means we're not resetting, saving in the middle of a game, it has an idea and it gets patched
		var check = checkWinner();
		if(game.id) {
			updateGame();	
		}
		//we are resetting this is a new game, can't be patched because it has no idea, so post
		else {
			saveGame();
		}
	});
}

function doTurn(event) {
	// update board with current player
	updateState(event);

	// determine winner
	var check = checkWinner();
	if (check === true || turn === 8) {
		console.log("checked");
		//reset turn
		turn = 0;
		saveGame();
		resetBoard();
	}
	else {
		turn++;		
	};
	console.log(game);
};


function player() {
	if (turn % 2 === 0 || turn === 0)  {
		return "X";
	}
	else {
		return "O";
	}
}

function updateState(event) {
	var currentPlayer = player();
	var x = event.target.dataset.x;
  var y = event.target.dataset.y;
  var coordinates = [parseInt(x), parseInt(y)];
  var space = getPosition(coordinates);
  game.state[space] = currentPlayer;
  $(event.target).text(currentPlayer);
	// if ($(event.target).is(':empty')) {
	// 	$(event.target).html(currentPlayer);
	// };
};

function getPosition(value) {
  for (var key in position) {
    if ((position[key][0] == value[0]) && (position[key][1] == value[1])) return key;
  }
  return false;
};

function message(string) {
	$('#message').html(string);
}

function checkWinner() {
	var winner;
	console.log("Turn:" + turn);
	if (turn > 3 && turn <= 8) {
		for (var i = 0, len = winningCombos.length; i < len; i++) {
			//check whether combo has a winner
			winner = checkCells(winningCombos[i]);
			//if it returned x, x won
			if (winner === "X") {
				message("Player X Won!");
				return true;
			}
			//same for o
			else if (winner === "O") {
				message("Player O Won!");
				return true;
			}
		}
		//if we made it through the loop with no winner its a tie
		message("Tie game");
		return false;
	}
	//for when turn isn't yet 3
	return false;
}

function checkCells(winningCombo) {
	var result;
	//get cells
	var cellsArray = $('td');
	var firstCell = $(cellsArray[winningCombo[0]]);

	//no win
	if (!firstCell.is(':empty')) {
		
		var cell0 = cellsArray[winningCombo[0]].innerHTML;
		var cell1 = cellsArray[winningCombo[1]].innerHTML;
		var cell2 = cellsArray[winningCombo[2]].innerHTML;

		// win
		if (cell0 === cell1 && cell1 === cell2) {
			var result = cell0;
		}
	}
	return result;
}

function getState() {
	var board = []
 	var cells = ($('td'));
 	for (var k = 0; k < 9; k++) {
 		board.push(cells[k].innerHTML);
 	}
 	return board;
}

function saveGame(over){
	console.log(game);
  $.ajax({
      method: "post",
      url: "/games",
      data: {game}
    }).done(function(response) {
    	console.log(response);
    	game.id = response.game["id"];
      // if (over === true) {
      //   resetBoard();
      // } else {
      //   game.id = response.game["id"];
      // }
    });
}

function updateGame(over) {
  $.ajax({
    method: 'patch',
    url: '/games/' + game.id,
    data: {game}
  }).done(function() {
    if (over) {
      resetBoard();
    }
  });
}

function resetBoard() {
  console.log("resetting");
  game.state = ["", "", "", "", "", "", "", "", ""];
  game.id = undefined;
  $('td').text("");
  turn = 0;
  saved = false;
};


