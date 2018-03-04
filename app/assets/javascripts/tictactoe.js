// Code your JavaScript / jQuery solution here
class Game {
	constructor(id = null, state = ['','','','','','','','','']){
		this.id = id
		this.state = state//response['attributes']['state']
		this.xyindex = ['00', '10', '20', '01', '11', '21', '02', '12', '22']
	}
}
current_game = new Game
turn = 0
winCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
$(function(){
	attachListeners()
})

function attachListeners(){
	$('td').on('click', doTurn)
	$('#save').on('click', saveGame)
	$('#previous').on('click', getAllGames)
	$('#clear').on('click', clearAndNewGame)
	$("#games").on('click', '.gameId', getGame)
}

///////// AJAX REQUESTS //////////

function getAllGames(){
	$.getJSON('/games', function(data){
		$('#games').html("")
		data['data'].forEach(r => $("#games").append('<button class="gameId">' + r['id'] + '</button>'))
	})
}

function getGame(){
	let id = this.innerText
	$.getJSON(`/games/${id}`, function(data){
		loadGame(data['data']['attributes']['state'])
		current_game.id = data['data']['id']
		current_game.state = data['data']['attributes']['state']
		setTurn()
	})
}

function saveGame(){
	const squareStates = $('td').toArray().map(square => square.innerText)
	if (current_game.id != null){
		let posting = $.post(`/games/${current_game.id}`, {_method: 'PATCH', state: squareStates})
	} else {
		let posting = $.post('/games', {state: squareStates})
	}
}

////////// DISPLAY CHANGERS ///////////

function clearAndNewGame(){
	current_game.state = ['','','','','','','','','']
	current_game.id = null
	turn = 0
	loadGame(current_game.state)
}

function loadGame(game_state){
	for (let i = 0; i < game_state.length; i++){
		$('td')[i].innerText = game_state[i]
	}
}

////////// GAME FUNCTIONS ////////////

function setTurn(){
	turn = $('td').toArray().filter(square => square.innerText !== "").length
}

function checkIndex(square){
	let xy = (square.dataset.x + square.dataset.y)
	return current_game.xyindex.indexOf(xy)
}


function player(){
	return (turn % 2) === 0 ? 'X' : 'O'
}

function updateState(square){
	let playerTurn = player()
	//debugger
	if(square.innerText === ""){
		square.innerText = playerTurn
	} else {
		setMessage("Spot already taken")
		turn -= 1
	} 
}

function setMessage(string){
	$('#message').text(string)
}

function checkWinner(){
	let result = ''
	for(let i = 0; i < winCombos.length; i++){

		if ($('td')[winCombos[i][0]].innerText === "X" && $('td')[winCombos[i][1]].innerText === "X" && $('td')[winCombos[i][2]].innerText === "X"){
			setMessage("Player X Won!")
			return true
		} else if ($('td')[winCombos[i][0]].innerText === "O" && $('td')[winCombos[i][1]].innerText === "O" && $('td')[winCombos[i][2]].innerText === "O") {
			setMessage("Player O Won!")
			return true
		}
	}
	if (turn === 9){
		setMessage("Tied game")
		return true
	}
}

function doTurn(){
	turn += 1
	updateState($(this).toArray()[0])
	if (checkWinner() === true){
		//debugger
		saveGame()
		clearAndNewGame()
	}

}







