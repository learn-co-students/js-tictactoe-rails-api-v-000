// Code your JavaScript / jQuery solution here
var gameid = 0
var turn = 0

window.onload = function(){
	attachListeners()

}



function clearBoard(){ 
const boxes = window.document.querySelectorAll('td');
  for (let i = 0; i < 9; i++) {
    boxes[i].innerHTML = "";
  }
  turn = 0
  gameid = 0
}

function turncount(){
	const boxes = window.document.querySelectorAll('td');
	for (let i = 0; i < 9; i++) {
    if (boxes[i].innerHTML != ""){turn += 1}
  }
}

function saveBoard(){
	const boxes = window.document.querySelectorAll('td');
	let state = []
	for (let i = 0; i < 9; i++) {
	state[i] = boxes[i].innerHTML
	}
 	stateString = JSON.stringify(state)
	 let posting = $.post('/games', {"state" : stateString});
      posting.done(function(data) {
      gameid = data["data"]["id"]
      previousGames()
      });
}

function updateBoard(gid){
	const boxes = window.document.querySelectorAll('td');
	let state = []
	for (let i = 0; i < 9; i++) {
	state[i] = boxes[i].innerHTML
	}
    
	let url = "/games/"+gid
 	stateString = JSON.stringify(state)
 	$.ajax({
	  url : url,
	  data : {state: stateString},
	  type : 'PATCH',
	  
	});
 	
}

function player(){
const boxes = window.document.querySelectorAll('td');
 if (turn % 2 === 0){return "X"}
 	else {return "O"}
}

function updateState(boxid){
	boxid.innerHTML = player()
}

function setMessage(string){
	$('#message').html(string)
}

function checkWinner(){
	var board = ["","","","","","","","",""]
	const WIN_COMBINATIONS =[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
	let winner = false
	const boxes = window.document.querySelectorAll('td');
  for (let i = 0; i < 9; i++) {
    board[i] = boxes[i].innerHTML;
  }
  WIN_COMBINATIONS.forEach(function(combo){
  	let tempx = combo.every(function(number){
  		if (board[number] === "X"){return true}
  	})
  	let tempo = combo.every(function(number){
  		if (board[number] === "O"){return true}
  	})
  		if (tempx === true) {
  			setMessage("Player X Won!")
  			winner = true
  			
  		} 
  		if (tempo === true){
  			setMessage("Player O Won!")
  			winner = true
  			
  		}
  })
  if (winner === true) {return true} else {return false}
}

function doTurn(event){
if (event.innerHTML === "" && !checkWinner()){
	updateState(event)
	if (checkWinner()) {
		turn = 0
		saveBoard()
		gameid = 0 
		clearBoard()
  	} 

  	else {
  			turn += 1
  			if (turn === 9) {
  				setMessage("Tie game.")
  				saveBoard()
  				gameid = 0}
  		}
	}}

function previousGames(){
	$.get("/games", function(data) {
		$('#games').empty()
		data["data"].forEach(function(game){
		$('#games').append("<button class='load'>"+game.id+"</button><br>")
		})
		$(".load").on('click', function(event){
  		loadGame()
  		})
	})
}

function loadGame(){
let game = event.target.innerHTML
let board = $.get("/games/"+game)
setMessage("")
board.done(function(data){
	let state = data["data"]["attributes"]["state"]
	gameid = game
	const boxes = window.document.querySelectorAll('td');
  	for (let i = 0; i < 9; i++) {
    boxes[i].innerHTML = state[i];
	}
})}

function attachListeners(){
  $("td").on('click', function(event) {
  	doTurn(event.target)
  })
  $("#previous").on('click', function(event){
  	previousGames()
  	
  })
  $("#clear").on('click', function(event){
  	clearBoard()
  
  })
  $("#save").on('click', function(event){
  
  	if (gameid === 0){saveBoard()}
  	else {updateBoard(gameid)}

  })

}




