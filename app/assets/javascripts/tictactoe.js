var turn = 0;

// [x,y]
var winningCombinations = [
	[[0,0],[1,0],[2,0]],
	[[0,1],[1,1],[2,1]],
	[[0,2],[1,2],[2,2]],
	[[0,0],[1,1],[2,2]],
	[[0,0],[0,1],[0,2]],
	[[1,0],[1,1],[1,2]],
	[[2,0],[2,1],[2,2]],
	[[2,0],[1,1],[0,2]]
];

// ID of game being shown on screen
var currentGame;

// Above are the variables that should be accessible by all functions


function attachListeners() {
	// starts a game as soon as a click is done on the table
	$('td').on('click', function(event){
		doTurn(event);
	})

	// switches the game when any of the elements from the #game div is clicked
	$("#games").click(function(event) {
		var state = parseState(event)
		swapGame(state, getGameId(event))
	});	

	// saves the game when #save button is clicked
	$("button#save").click(function(event) {
		saveGame();
	});	

	// shows previous games when the #previous button is clicked
	$("button#previous").on("click", getPreviousGames);
}

function doTurn(event) {
	updateState(event);
	if ( checkWinner() || checkTie() ) {
		// saves and resets current game
		saveGame(true);
		reset();
	} else {
		turn += 1;
	}
}

function player() {
	// depending on the turn, provides the good player's sign
	return turn % 2 == 0 ? "X" : "O" ;
}

function updateState(event) {
	// console.log(event.target);
	// print to the board the right player's sign
	var target = event.target;
	$(target).html( player() );
}

function message(string) {
	$('#message').html( string );
}


function checkWinner() {
	// takes each winningCombination, eg [0,0],[1,0],[2,0] and checks if any is present on the board
	for (var i = 0; i < winningCombinations.length; i++) {
		if ( checkCombination( winningCombinations[i] ) ) {
			console.log(winningCombinations[i]);
			message("Player " + player() + " Won!");
			return true;
		}
	};
	// if the loop hasn't "returned" yet then it means there is no winner
	return false;
}

function checkCombination(combi) {
	// checks if a combination is present on the board, eg [0,0],[1,0],[2,0]
	for(var i = 0; i < combi.length; i++) {
		var winningCombo = combi[i];
		var x = winningCombo[0]; 
		var y = winningCombo[1];
		var cell = $('[data-x="' + x + '"][data-y="' + y + '"]')
		if ( cellDifferent(cell) ) {
			// breaks out of the function if one of the cells doesn't correspond to the combination
			return false;
		}
	}
	// if the loop hasn't returned false yet it means the combination is present on the board
	return true;
}

function cellDifferent(cell) {
	// returns true if the cell doesn't contain the same html than the current player's sign (X or O)
	return !(cell.html() == player());
}

function checkTie() {
	var tie = true;
	$('td').each(function(){
		if ( $(this).html().length <= 0 ) {
			console.log($(this).html().length);
			tie = false;
		};
	});
	if (tie) message("Tie game");
	return tie;
}

function reset() {
	$('td').html("");
	turn = 0;
	currentGame = 0;
}

// ----------------------- browsing games

// gets the JSON from GamesController#index and lists previous games on the click of the "Show Previous Games" button
function getPreviousGames() {
	$.getJSON("/games").done(function(response){
		console.log(response.games);
		showGames(response.games);
	});
}

// take the list of games received by AJAX request and displays them in the #games div
function showGames(games){
	var dom = $();
	games.forEach(function(game) {
		dom = dom.add( showGame(game) );
	})
	$("#games").html(dom);
}

function showGame(game) {
	return $('<li>', {'data-state': game.state, 'data-gameid': game.id, text: 'Game n°' + game.id});
}


// ----------------------- switching games

// is called by click event
function swapGame(state, id) {
	placeMarks(state);
	currentGame = id;
	turn = findTurn(state);
}

// gets the state for the clicked game
function parseState(event) {
  return $(event.target).data("state").split(",");
}

// gets the game id
function getGameId(event) {
  return $(event.target).data("gameid");
}

// deduce the turn from the state of the game and updates the "turn" variable
var findTurn = function(state) {
  var turn = 0;
  state.forEach(function(item) {
    if(item != "") {
      turn += 1;
    }
  })
  return turn;
}

// prints the marks to the board
var placeMarks = function(marks) {
  $("td").each(function(i) {
    $(this).text(marks[i]);
  })
}


// ----------------------- saving game

// stores game state in an array
function getMarks() {
  var marks = []
  $("td").each(function(i) {
    marks.push($(this).text())
  })
  return marks;
}

// save with resetCurrentGame that can be set to true
function saveGame(resetCurrentGame) {
	var url, method;

	// if no currentGame is defined (has never been saved) we do a POST request, otherwise if replay we PATCH
	if ( currentGame ) {
		url = '/games/' + currentGame;
		method = 'PATCH';
	} else {
		url = '/games';
		method = 'POST';
	}

	$.ajax({
		url: url,
		method: method,
		dataType: "json",
		data: {
			game: {
				state: getMarks()
			}
		},
		success: function(data){
			if ( resetCurrentGame ) {
				currentGame = undefined;
			} else {
				console.log(data);
				currentGame = data.id;
			};
		}
	});

}


// Calls the trigger function when document is ready

$(document).ready(function(){
	attachListeners();
})