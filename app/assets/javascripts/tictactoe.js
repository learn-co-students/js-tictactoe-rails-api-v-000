

const WINNING_COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7], [2,5,8],[0,4,8],[2,4,6]]

var turn = 0
var currentID = 0



$(function(){ 
  attachListeners()
});



function player () {
	return (turn % 2 == 0) ? 'X' : 'O'
}

function updateState (square) {
	$(square).text(player())
}

function setMessage(string) {
	$("div#message").html(string)
}


function checkWinner() {
	var board = []
	var won = false

  $('td').text((index,square) => board[index] = square) 
  // debugger

	WINNING_COMBOS.forEach (function (position) {

		if (board[position[0]] === board[position[1]] && board[position[1]] === board[position[2]] && board[position[0]] !== "") {
			setMessage(`Player ${board[position[0]]} Won!`)
			won = true
		}
	})
	return won
}


function resetBoard() {
	$('td').empty()
	turn = 0
}


function endGame() {
	saveGame()
	resetBoard()
}

function doTurn(square) {
  	updateState(square)
  	turn++

	if (checkWinner()) {
		endGame()
	} else if (turn === 9) {
		setMessage("Tie game.")
		endGame()
	}
}


function clearGames() {
  resetBoard()
  currentID = null
}



function openGame(id) {

  $.get(`/games/${id}`, function(game) {
    // debugger
    currentID = id

    let state = game.data.attributes.state
    turn = state.filter(String).length

    $("td").html((index, player) => state[index])
  })  
}





function previousGames() {
  $("#games").empty()

  $.get("/games", function(games) {

      games.data.forEach(function(game) {

        let gameBtn = `<button id="gameid-${game.id}">Open Game: #${
            game.id}</button>`

        $("#games").append(gameBtn)

        $(`#gameid-${game.id}`).on("click", () => openGame(game.id))
      })
  })
}








function saveGame() {
  let state = Array.from($("td"), e => e.innerText)

  if (currentID) {
    $.ajax({url: `/games/${currentID}`, data: { 'state': state }, type: "PATCH"})

  } 
  else {
    $.post(`/games`, { 'state': state }, function(game) {
      currentID = parseInt(game.data.id)
    })
  }
}









function attachListeners() {
  $("#save").on("click", () => saveGame())
  $("#previous").on("click", () => previousGames())
  $("#clear").on("click", () => clearGames())


  $("td").on("click", function() {
    if (!checkWinner() && !$.text(this)) {
      doTurn(this)
    }
  })
}
