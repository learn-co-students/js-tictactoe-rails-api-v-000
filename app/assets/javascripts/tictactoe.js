// Code your JavaScript / jQuery solution here
let turnCount = 0;
let state = ["","","","","","","","",""]
const WIN_COMBINATIONS = [
	[0,1,2,],[1,3,6],[0,4,8],[1,4,7],[2,5,8],[2,4,6],[3,4,5],[6,7,8]
	]

function player(){
		return turnCount%2 ? "X" : "O";
	}

function doTurn(el){
	el.innerHTML = player();
	updateState(el);
	checkWinner();
	turnCount++;

}

function checkWinner(){

	let xs = [];
	let os = [];
	for(let i = 0; i<=state.length-1; i++){
		if (state[i] === "X"){
			xs.push(i);
		} else if (state[i] === "O") {
			os.push(i);
		}
	}
		console.log("O = ", os);
		console.log("X = ", xs);

	WIN_COMBINATIONS.forEach(function(combo){

		 if (combo.every(v => os.includes(v))) {
		 	return setMessage("O");
		 } else if (combo.every(v => xs.includes(v))) {
		 	return setMessage("X");
		 }
	});

}

function setMessage(winner){
	$("#message").text(`${winner} is the winner!`);
}

function updateState(el){
	let position = $(el)[0].id;
	state[position] = player();
}



$(function(){


	$("td").on("click", function(){
		doTurn(this);
		
	})

	$("#save").on("click", function(){
		$.post('/games', {state: state})
	})

	$("#previous").on("click", function(){
		$.get('/games').done(function(response){
			let html = "<ul>";
			response.data.forEach(function(game){
				html += `<li id="gameListItem" >${game.id}</li>`
			});
			html+= "</ul>";
			$("#games").html(html);
		})
	})

	$("#gameListItem").on("click", function(){
		console.log("Clicked game");
	})

	$("#clear").on("click", function(){
		$("td").text("");
		state = ["","","","","","","","",""];
	})
	
});
