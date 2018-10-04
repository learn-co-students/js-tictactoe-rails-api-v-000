// Code your JavaScript / jQuery solution here
var turn = 0;
const squares = document.getElementsByTagName('td');
let gameId = 0;
const WIN_COMBINATIONS = [
	[0,1,2,],[1,3,6],[0,4,8],[1,4,7],[2,5,8],[2,4,6],[3,4,5],[6,7,8]
	]

function player(){
	return turn%2 ? "O" : "X";
}

function doTurn(el){
	updateState(el);
	if (checkWinner()){
		saveGame();
		turn = 0;
		$("td").text("");
		gameId = 0;
	} else if (turn >= 8) {
		setMessage("Tie game.")
		saveGame();
		turn = 0;
		gameId = 0;
		$("td").text("");

	} 
}

function checkWinner(){

	let xs = [];
	let os = [];
	for(let i = 0; i<=8; i++){
		if (squares[i].innerHTML === "X"){
			xs.push(i);
		} else if (squares[i].innerHTML === "O") {
			os.push(i);
		}
	}

	 let win = false;

	 WIN_COMBINATIONS.forEach(function(combo){

		 if (combo.every(v => os.includes(v))) {
		 	setMessage("Player O Won!")
		 	win = true;
		 } else if (combo.every(v => xs.includes(v))) {
		 	setMessage("Player X Won!");
		 	win = true;
		 }
	});

	 return win;

}

function setMessage(message){
	$("#message").text(message);
}

function updateState(el){
	if(el.innerHTML != "X" && el.innerHTML != "O"){
		$(el).html(player());
		turn++;
	}
	
}

function saveGame(){

	let arr = [];
	
	for(let i = 0; i<squares.length; i++){
		arr[i] = squares[i].innerHTML;
	}


	if (gameId > 0) {
		$.ajax(`/games/${gameId}`, {
		    contentType: "application/json",
		    data: JSON.stringify({"state": arr}),
		    dataType: "json",
		    method: "PATCH"
		});
		console.log("Saved to old save slot");
	} else {
		// $.post('/games', {state: arr}, function(data){
		// 	gameId = data.id
		// 	console.log(data)
		// })

		$.ajax(`/games`, {
		    contentType: "application/json",
		    data: JSON.stringify({"state": arr}),
		    dataType: "json",
		    method: "POST",
		    success: function(response){
		    	gameId = response.data.id;	
		    }
		});


	}

}

function attachListeners(){

	$("td").on("click", function(){
		if(!checkWinner() && turn < 8){
			doTurn(this);
		}
	});

	$("#save").on("click", function(){
		saveGame();
	});

	$("#previous").on("click", function(){
		$.get('/games').done(function(response){
			if(response.data.length > 0){
				let html = "";
				response.data.forEach(function(game){

					html += "<button class='gameButton'>" + game.id + "</button>";
				});
				$("#games").html(html);

				$("button.gameButton").on("click", function(el){
					$.get('/games/' + el.target.innerHTML).done(function(response){
						
						response.data.attributes.state.map((square, index) => squares[index].innerHTML = square )
						turn = response.data.attributes.state.filter(s => s !== '').length
						gameId = response.data.id
					});
					
					
				});

			}
		});
	});



	$("#clear").on("click", function(){
		$("td").text("");
		turn = 0;
		$("#message").text("");
		gameId = 0;
	});

}

$(function(){

	attachListeners();

});
