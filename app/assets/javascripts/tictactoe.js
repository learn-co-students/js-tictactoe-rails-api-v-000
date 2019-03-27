// Code your JavaScript / jQuery solution here

var turn = 0
window.onload = function(){
	attachListeners()

}

// $(function () {
//   $(".box").on('click', function(event) {
//   	updateState(event.target)
//   	turn += 1
    
//   })
// })

function clearBoard(){ 
const boxes = window.document.querySelectorAll('td');
  for (let i = 0; i < 9; i++) {
    boxes[i].innerHTML = "";
  }
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
       console.log(data)
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
if (event.innerHTML === ""){
	updateState(event)
	if (checkWinner()) {
		turn = 0
		clearBoard()
  	} 

  	else {
  			turn += 1
  			if (turn === 9) {setMessage("Tie game.")}
  		}
	}}

function previousGames(){
	$.get("/games", function(data) {
		$('#games').empty()
		data["data"].forEach(function(game){
		$('#games').append("<a href='/games/"+game.id+"'>"+game.id+"</a>")})
	})
}


function attachListeners(){
  $("td").on('click', function(event) {
  	doTurn(event.target)
  })
  $("#previous").on('click', function(event){
  	previousGames()
  })
  $("#clear").on('click', function(event){
  	clearBoard()
  	$('#message').html("")
  })
  $("#save").on('click', function(event){
  	saveBoard()
  })
}




