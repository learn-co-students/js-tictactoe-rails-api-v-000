var turn = 0;
var currentGame;
var winningCombos = [
[[0,0],[1,0],[2,0]], 
[[0,1],[1,1],[2,1]], 
[[0,2],[1,2],[2,2]], 
[[0,0],[1,1],[2,2]], 
[[0,0],[0,1],[0,2]], 
[[2,0],[2,1],[2,2]], 
[[1,0],[1,1],[1,2]], 
[[2,0],[1,1],[0,2]]
];

function attachListeners(){
	$("td").on("click", doTurn);
	$("button#save").on("click", saveGame);
	$("button#previous").on("click", getGames);
}

function getGames(){
	$.get("/games", function(data){
		data["games"].forEach(function(game){
			console.log(game);
			var renderedGame = '<div class="game" data-gameid="' + game.id + '" data-state="' + game.state + ' ">';
			renderedGame		+= 		'<h4>Game ' + game.id + '</h4>'
			renderedGame		+=		'<p>Status ' + game.state + '</p>'
			renderedGame 		+= '</div>';
			$("body").append(renderedGame);
		})

		$(".game").on("click", switchGame);
	})
}

function switchGame(event){
	var id = $(this).data("gameid");
	var state = $(this).data("state");
	currentGame = id;
	console.log("switching to game " + id);
	checkWinner();

	renderState(state);
}

function renderState(state){
	console.log("loading state " + state);
	var stateArr = state.split(",");
	turn = 0;
	stateArr.forEach(function(cell){
		if(cell == "X" || cell == ""){
			turn++;
		}
	})
	console.log("state array is " + stateArr);
	$("td").each(function(index, cell){
		$(cell).text(stateArr[index]);
	})
}

function doTurn(event){
	var cell = $(this);
	if(cell.text() != "X" && cell.text() != "O"){
		turn++;
		updateState(cell);
		checkWinner();	
	}
	else{
		alert("Please click on an empty cell!");
	}
}

function updateState(cell){
	cell.text(player());
}

function isX(cellCoords){
	var cell = $('[data-x="' + cellCoords[0] + '"][data-y="' + cellCoords[1] + '"]');
	return cell.text() == "X"
}

function isO(cellCoords){
	var cell = $('[data-x="' + cellCoords[0] + '"][data-y="' + cellCoords[1] + '"]');
	return cell.text() == "O"
}

function message(string){
	$("div#message").text(string);
}


function player(){
	if(turn % 2 == 0){
		return "O";
	}
	else{
		return "X";
	}
}

function checkWinner(){

  winningCombos.forEach(function(combo){
  	var allX = combo.every(isX);

  	var allO = combo.every(isO);

  	if(allX){
  		message("Player X Won!");
  		newGame();
  	}
  	else if(allO){
  		message("Player O Won!");
  		newGame();
  	}
  	else if(turn == 9){
  		message("Tie game");
  		newGame();
  	}
  });
 
}

function getState(){
	var state = [];
	$("td").each(function(cell){
		var text = $(this).text();
		state.push(text);
	});
	return state;
}

function saveGame(){
	var url;
	var verb;
	var data = {game: {state: getState()} };

	if(currentGame){
		url = "/games/" + currentGame;
		verb = "PATCH";
		data.id = currentGame;
	}
	else{
		url = "/games";
		verb = "POST";
	}

	$.ajax({
		url: url,
		type: verb,
		data: data
	}).done(function(data){
		currentGame = data.game.id;
		console.log("The current game is " + currentGame);
	})
}

function newGame(){
	saveGame();
	currentGame = null;
	turn = 0;
	$("td").text(" ");
}

$(document).ready(function(){
	attachListeners();
});